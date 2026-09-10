import 'reflect-metadata';
import { createNestApp } from './app.factory.js';
import { env } from './config/env.js';

async function bootstrap() {
  const { app } = await createNestApp();
  await app.listen(env.PORT);
  console.log(`🚀 ORION API (NestJS) rodando na porta ${env.PORT}`);
}

bootstrap();
