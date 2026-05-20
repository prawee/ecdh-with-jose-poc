import { CompactEncrypt, importJWK } from 'jose';
import type { KeyLike, JWK } from 'jose';
import type { EncryptOptions } from './types.js';

/**
 * Encrypt a payload as a compact JWE string using ECDH-ES key agreement.
 * Works in both browser (Web Crypto) and Node.js environments.
 *
 * @param payload   - Any JSON-serialisable value to encrypt
 * @param serverPublicJwk - Server's EC public key in JWK format
 * @param options   - Optional algorithm overrides
 * @returns Compact JWE string  (header.encryptedKey.iv.ciphertext.tag)
 */
export async function encryptPayload(
  payload: unknown,
  serverPublicJwk: JWK,
  options: EncryptOptions = {},
): Promise<string> {
  const alg = options.alg ?? 'ECDH-ES+A256KW';
  const enc = options.enc ?? 'A256GCM';

  const publicKey = (await importJWK(serverPublicJwk, alg)) as KeyLike;

  const plaintext = new TextEncoder().encode(JSON.stringify(payload));

  return new CompactEncrypt(plaintext)
    .setProtectedHeader({ alg, enc })
    .encrypt(publicKey);
}
