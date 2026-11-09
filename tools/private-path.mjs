#!/usr/bin/env node
/**
 * Print the SHA-256 digest of a private path, for VITE_PRIVATE_PATH_HASH.
 *
 *   node tools/private-path.mjs                 # invent a new random path
 *   node tools/private-path.mjs my-secret-path  # hash one you chose
 *
 * The site stores only the digest, so the URL cannot be recovered by reading
 * the JavaScript. A random 16-character path is ~96 bits: not guessable.
 */
import { createHash, randomBytes } from 'node:crypto';

const path = process.argv[2] ?? randomBytes(12).toString('base64url');
const hash = createHash('sha256').update(path).digest('hex');

console.log(`VITE_PRIVATE_PATH=${path}`);
console.log(`VITE_PRIVATE_PATH_HASH=${hash}`);
console.log(`\nThe page will live at:  /${path}`);
