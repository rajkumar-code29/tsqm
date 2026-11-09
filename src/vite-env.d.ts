/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** SHA-256 of the unlisted private path. Only the digest is compiled in. */
  readonly VITE_PRIVATE_PATH_HASH?: string;
  /** Basename of the sealed payload served from public/. */
  readonly VITE_PRIVATE_ASSET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
