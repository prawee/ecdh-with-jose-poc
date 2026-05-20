import { Injectable, OnModuleInit } from '@nestjs/common';
import { generateEcKeyPair } from '@repo/jose-utils';
import type { EcKeyPairJwk, JWK } from '@repo/jose-utils';

/**
 * Generates and holds the server's EC key pair.
 * In production, load privateKey from a KMS or secrets manager instead.
 */
@Injectable()
export class EcKeysService implements OnModuleInit {
  private keyPair!: EcKeyPairJwk;

  async onModuleInit() {
    this.keyPair = await generateEcKeyPair();
    console.log('[EcKeysService] EC P-256 key pair ready');
  }

  getPublicJwk(): JWK {
    return this.keyPair.publicKey;
  }

  getPrivateJwk(): JWK {
    return this.keyPair.privateKey;
  }
}
