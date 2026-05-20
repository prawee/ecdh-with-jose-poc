import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { decryptToken } from '@repo/jose-utils';
import { EcKeysService } from './ec-keys.service.js';

interface DecryptBody {
  token: string;
}

@Controller('crypto')
export class CryptoController {
  constructor(private readonly ecKeys: EcKeysService) {}

  /**
   * GET /crypto/public-key
   * Returns the server's EC public key as JWK.
   * Clients use this to encrypt payloads before sending.
   */
  @Get('public-key')
  getPublicKey() {
    return this.ecKeys.getPublicJwk();
  }

  /**
   * POST /crypto/decrypt
   * Accepts a compact JWE token, decrypts it, and returns the payload.
   * In a real app you'd use this inside a Guard or pipe — not expose it raw.
   */
  @Post('decrypt')
  async decrypt(@Body() body: DecryptBody) {
    if (!body?.token) {
      throw new BadRequestException('Missing "token" field');
    }

    const { payload, protectedHeader } = await decryptToken(
      body.token,
      this.ecKeys.getPrivateJwk(),
    );

    return { payload, protectedHeader };
  }
}
