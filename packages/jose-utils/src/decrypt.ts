import { compactDecrypt, importJWK } from 'jose';
import type { KeyLike, JWK } from 'jose';
import type { DecryptResult } from './types.js';

/**
 * Decrypt a compact JWE string using the server's EC private key.
 * Intended for Node.js / NestJS server-side use only.
 *
 * @param token      - Compact JWE string received from the client
 * @param privateJwk - Server's EC private key in JWK format
 * @returns Decrypted payload parsed as T, plus the protected header
 */
export async function decryptToken<T = unknown>(
  token: string,
  privateJwk: JWK,
): Promise<DecryptResult<T>> {
  const privateKey = (await importJWK(privateJwk, 'ECDH-ES')) as KeyLike;

  const { plaintext, protectedHeader } = await compactDecrypt(token, privateKey);

  const payload = JSON.parse(new TextDecoder().decode(plaintext)) as T;

  return { payload, protectedHeader: protectedHeader as Record<string, unknown> };
}
