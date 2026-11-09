/**
 * Client-side vault for the private collection page.
 *
 * WHAT THIS DOES
 * The collection's text lives on the server as AES-256-GCM ciphertext in a
 * separate file that is only fetched once someone types an access code. The
 * key is derived from that code with PBKDF2-SHA256 over 600,000 iterations.
 * Neither the access code nor the plaintext appears anywhere in the site's
 * source, so downloading the whole site reveals nothing but random bytes.
 *
 * WHAT THIS DOES NOT DO
 * It is not server-side access control. Anyone holding a correct access code
 * can decrypt the file, and the ciphertext itself is publicly fetchable by
 * anyone who knows the URL. That is the strongest guarantee available to a
 * site with no backend: secrecy of the content, not of the file's existence.
 * If the charity later needs revocable, per-person access with an audit
 * trail, the payload must move behind a server that authenticates the request.
 */

const PBKDF2_ITERATIONS = 600_000;
const KEY_LENGTH_BITS = 256;

export interface SealedPayload {
  v: 1;
  /** base64 */
  salt: string;
  /** base64, 12 bytes */
  iv: string;
  /** base64 */
  ct: string;
  iterations: number;
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function isSealedPayload(value: unknown): value is SealedPayload {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    p.v === 1 &&
    typeof p.salt === 'string' &&
    typeof p.iv === 'string' &&
    typeof p.ct === 'string' &&
    typeof p.iterations === 'number'
  );
}

async function deriveKey(passphrase: string, salt: Uint8Array, iterations: number) {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase.normalize('NFKC')),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: KEY_LENGTH_BITS },
    false,
    ['decrypt'],
  );
}

export class VaultError extends Error {
  constructor(
    message: string,
    readonly kind: 'unavailable' | 'network' | 'malformed' | 'wrong-code',
  ) {
    super(message);
    this.name = 'VaultError';
  }
}

/**
 * Fetch the sealed payload and decrypt it with `passphrase`.
 *
 * A wrong code fails at the GCM authentication tag, which is indistinguishable
 * from tampering — so we surface a single generic error rather than leaking
 * which part went wrong.
 */
export async function unseal<T>(url: string, passphrase: string): Promise<T> {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new VaultError(
      'Secure decryption is unavailable. This page needs a modern browser over HTTPS.',
      'unavailable',
    );
  }

  let payload: unknown;
  try {
    const response = await fetch(url, { cache: 'no-store', credentials: 'omit' });
    if (!response.ok) throw new Error(String(response.status));
    payload = await response.json();
  } catch {
    throw new VaultError('The collection could not be loaded. Please try again.', 'network');
  }

  if (!isSealedPayload(payload)) {
    throw new VaultError('The collection file is not in the expected format.', 'malformed');
  }

  // Clamp to the published work factor so a swapped-in file cannot weaken it.
  const iterations = Math.max(payload.iterations, PBKDF2_ITERATIONS);

  try {
    const key = await deriveKey(passphrase, fromBase64(payload.salt), iterations);
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64(payload.iv) as BufferSource },
      key,
      fromBase64(payload.ct) as BufferSource,
    );
    return JSON.parse(new TextDecoder().decode(plaintext)) as T;
  } catch {
    throw new VaultError('That access code was not recognised.', 'wrong-code');
  }
}

/**
 * Throttle repeated attempts. Each failure roughly doubles the wait, capped at
 * a minute, which makes online guessing impractical without annoying the one
 * person who fat-fingered their code.
 */
const ATTEMPTS_KEY = 'tsqm.vault.attempts';

function readAttempts(): { count: number; until: number } {
  try {
    const raw = sessionStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return { count: 0, until: 0 };
    const parsed = JSON.parse(raw) as { count?: unknown; until?: unknown };
    return {
      count: typeof parsed.count === 'number' ? parsed.count : 0,
      until: typeof parsed.until === 'number' ? parsed.until : 0,
    };
  } catch {
    return { count: 0, until: 0 };
  }
}

function write(state: { count: number; until: number }) {
  try {
    sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify(state));
  } catch {
    /* private browsing — throttling degrades, nothing else breaks */
  }
}

/** Seconds the caller must still wait, or 0 if they may try now. */
export function cooldownRemaining(): number {
  const { until } = readAttempts();
  return Math.max(0, Math.ceil((until - Date.now()) / 1000));
}

export function recordFailure(): void {
  const { count } = readAttempts();
  const next = count + 1;
  const delayMs = next < 3 ? 0 : Math.min(60_000, 2 ** (next - 2) * 1000);
  write({ count: next, until: Date.now() + delayMs });
}

export function clearFailures(): void {
  try {
    sessionStorage.removeItem(ATTEMPTS_KEY);
  } catch {
    /* ignore */
  }
}
