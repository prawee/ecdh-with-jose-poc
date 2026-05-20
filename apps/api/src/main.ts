import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow Next.js dev server to call the API
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    methods: ['GET', 'POST'],
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`[API] Running on http://localhost:${port}`);
}

bootstrap();
