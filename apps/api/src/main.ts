import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';
import { AppModule } from './app.module.js';
import { env } from './config/env.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';

const server: Express = express();
let isReady = false;

export async function createNestServer() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.init();
  isReady = true;
  return app;
}

// Execução local tradicional se não estiver no ambiente Serverless da Vercel
if (!process.env.VERCEL) {
  createNestServer().then((app) => {
    app.listen(env.PORT, () => {
      console.log(`🚀 ORION API (NestJS) rodando na porta ${env.PORT}`);
    });
  });
}

// Handler para Vercel Serverless Function
export default async function handler(req: any, res: any) {
  try {
    if (!isReady) {
      await createNestServer();
    }
    return server(req, res);
  } catch (err: any) {
    console.error('❌ Erro ao inicializar NestJS na Vercel:', err);
    if (!res.headersSent) {
      return res.status(500).json({
        statusCode: 500,
        error: 'Database or Server Initialization Error',
        message: err?.message || 'Erro ao inicializar aplicação na Vercel. Verifique a DATABASE_URL.',
      });
    }
  }
}
