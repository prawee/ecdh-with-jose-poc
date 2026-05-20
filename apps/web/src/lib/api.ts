import { encryptPayload } from '@repo/jose-utils';
import type { JWK } from '@repo/jose-utils';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/**
 * Encrypts `payload` with the server's public key, then POSTs the JWE token.
 * Returns the decrypted response from the server (demo only — in production
 * the server would act on the payload internally, not echo it back).
 */
export async function sendEncrypted<T>(
  payload: unknown,
  serverPublicJwk: JWK,
): Promise<T> {
  const token = await encryptPayload(payload, serverPublicJwk);

  const res = await fetch(`${API}/crypto/decrypt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}
