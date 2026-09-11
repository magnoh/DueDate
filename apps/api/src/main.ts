import 'reflect-metadata';
export { createNestApp } from './app.factory.js';
import { createNestApp } from './app.factory.js';
import { env } from './config/env.js';

async function bootstrap() {
  // Only start listening if we are not running in a serverless environment
  if (!process.env.VERCEL) {
    const { app } = await createNestApp();
    await app.listen(env.PORT);
    console.log(`🚀 ORION API (NestJS) rodando na porta ${env.PORT}`);
  }
}

bootstrap();
