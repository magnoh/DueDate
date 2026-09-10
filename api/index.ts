import 'reflect-metadata';
import { createNestApp } from '../apps/api/src/app.factory.js';

let cachedServer: any = null;
let initPromise: Promise<any> | null = null;

async function getServer() {
  if (cachedServer) {
    return cachedServer;
  }
  if (!initPromise) {
    initPromise = createNestApp().then(({ server }) => {
      cachedServer = server;
      return server;
    });
  }
  return initPromise;
}

export default async function handler(req: any, res: any) {
  // Diagnóstico leve
  if (req.url === '/api/ping' || req.url === '/ping') {
    return res.status(200).json({
      status: 'ok',
      hasDbUrl: !!process.env.DATABASE_URL,
      time: new Date().toISOString(),
    });
  }

  // Garante que o prefixo /api esteja presente para casar com os controllers NestJS
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/health')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }

  try {
    const server = await getServer();
    return server(req, res);
  } catch (err: any) {
    console.error('❌ Erro no handler serverless:', err);
    if (!res.headersSent) {
      return res.status(500).json({
        statusCode: 500,
        error: 'Serverless Handler Error',
        message: err?.message || 'Erro interno na função serverless',
        stack: err?.stack,
      });
    }
  }
}
