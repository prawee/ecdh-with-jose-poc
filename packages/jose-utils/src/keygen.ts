import { generateKeyPair, exportJWK } from 'jose';
import type { EcKeyPairJwk } from './types.js';

/**
 * Generate a new P-256 EC key pair and export both keys as JWK.
 * Call this once at server start (or use a KMS in production).
 */
export async function generateEcKeyPair(): Promise<EcKeyPairJwk> {
  const { publicKey, privateKey } = await generateKeyPair('ECDH-ES', {
    crv: 'P-256',
    extractable: true,
  });

  return {
    publicKey: await exportJWK(publicKey),
    privateKey: await exportJWK(privateKey),
  };
}
