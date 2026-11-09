#!/usr/bin/env node
/**
 * Seal the private collection.
 *
 *   node tools/seal-collection.mjs
 *
 * Reads the plaintext at content/collection.json, encrypts it with
 * AES-256-GCM under a key derived from an access code, and writes the
 * ciphertext to public/<PRIVATE_ASSET>.json. The plaintext file is never
 * deployed — only the sealed version goes to the web server.
 *
 * The access code is read from the TSQM_ACCESS_CODE environment variable, or
 * prompted for. It is never written to disk by this script; store it in a
 * password manager and give it to collectors out of band.
 *
 * To rotate the code, run this again with a new one and redeploy. Anyone
 * holding the old code can still read a copy of the old file they already
 * downloaded — rotation protects future access, not past.
 */

import { webcrypto as crypto } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout, env, exit } from 'node:process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PLAINTEXT = resolve(ROOT, 'content/collection.json');
const ENV_FILE = resolve(ROOT, '.env');

const ITERATIONS = 600_000;

function readAssetName() {
  // Keep the sealed file's name in step with VITE_PRIVATE_ASSET so the page
  // and the script never disagree about where the payload lives.
  const fallback = 'collection.sealed';
  if (!existsSync(ENV_FILE)) return fallback;
  const match = readFileSync(ENV_FILE, 'utf8').match(/^VITE_PRIVATE_ASSET\s*=\s*(.+)$/m);
  return match ? match[1].trim().replace(/^["']|["']$/g, '') : fallback;
}

async function getAccessCode() {
  if (env.TSQM_ACCESS_CODE) return env.TSQM_ACCESS_CODE;
  const rl = createInterface({ input: stdin, output: stdout });
  const code = await rl.question('Access code for the private collection: ');
  rl.close();
  return code;
}

const b64 = (bytes) => Buffer.from(bytes).toString('base64');

async function main() {
  if (!existsSync(PLAINTEXT)) {
    console.error(`Missing ${PLAINTEXT}`);
    exit(1);
  }

  const code = (await getAccessCode()).trim();
  if (code.length < 12) {
    console.error('Refusing to seal: use an access code of at least 12 characters.');
    exit(1);
  }

  // Validate the plaintext is real JSON before encrypting it, so a typo
  // cannot produce a file that only fails at the moment a collector looks.
  const plaintext = readFileSync(PLAINTEXT, 'utf8');
  JSON.parse(plaintext);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(code.normalize('NFKC')),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt'],
  );
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext),
  );

  const asset = readAssetName();
  const out = resolve(ROOT, `public/${asset}.json`);
  writeFileSync(
    out,
    JSON.stringify({ v: 1, salt: b64(salt), iv: b64(iv), ct: b64(ct), iterations: ITERATIONS }),
  );

  console.log(`Sealed ${plaintext.length} bytes -> public/${asset}.json`);
  console.log('The plaintext in content/ is git-ignored and never deployed.');
}

main().catch((err) => {
  console.error(err.message);
  exit(1);
});
