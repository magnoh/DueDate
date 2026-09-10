import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response } from 'express';
import { AppModule } from '../apps/api/src/app.module.js';
import { AllExceptionsFilter } from '../apps/api/src/common/filters/http-exception.filter.js';

const server: Express = express();
let isReady = false;
let initError: Error | null = null;

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    });
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
    isReady = true;
  } catch (err: any) {
    console.error('❌ Erro no bootstrap do NestJS na Vercel:', err);
    initError = err;
    throw err;
  }
}

export default async function handler(req: Request, res: Response) {
  try {
    if (!isReady) {
      if (initError) {
        throw initError;
      }
      await bootstrap();
    }
    return server(req, res);
  } catch (err: any) {
    console.error('❌ Erro na execução da Serverless Function:', err);
    return res.status(500).json({
      statusCode: 500,
      error: 'Serverless Function Error',
      message: err?.message || 'Erro interno na função serverless',
      stack: err?.stack,
    });
  }
}
