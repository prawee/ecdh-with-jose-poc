import type { JWK } from 'jose';

export interface EncryptOptions {
  /** JWE key agreement algorithm (default: ECDH-ES+A256KW) */
  alg?: 'ECDH-ES' | 'ECDH-ES+A128KW' | 'ECDH-ES+A192KW' | 'ECDH-ES+A256KW';
  /** JWE content encryption algorithm (default: A256GCM) */
  enc?: 'A128GCM' | 'A192GCM' | 'A256GCM' | 'A128CBC-HS256' | 'A256CBC-HS512';
}

export interface EcKeyPairJwk {
  publicKey: JWK;
  privateKey: JWK;
}

export interface DecryptResult<T = unknown> {
  payload: T;
  protectedHeader: Record<string, unknown>;
}
