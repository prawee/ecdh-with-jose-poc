import { Module } from '@nestjs/common';
import { EcKeysService } from './ec-keys.service.js';
import { CryptoController } from './crypto.controller.js';

@Module({
  providers: [EcKeysService],
  controllers: [CryptoController],
  exports: [EcKeysService],
})
export class CryptoModule {}
