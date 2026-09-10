import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AllExceptionsFilter } from '../common/filters/http-exception.filter.js';

describe('ORION Demands API — Integration Tests (NestJS)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /health', () => {
    it('deve retornar status 200 e { status: "ok" }', async () => {
      const response = await supertest(app.getHttpServer()).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/demands', () => {
    it('deve criar uma nova demanda com sucesso', async () => {
      const payload = {
        description: 'Implementar testes de integração automatizados NestJS',
        responsible: 'Dev Teste',
        dueDate: '2026-10-20T18:00:00.000Z',
        status: 'PENDING',
      };

      const response = await supertest(app.getHttpServer()).post('/api/demands').send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.description).toBe(payload.description);
      expect(response.body.responsible).toBe(payload.responsible);
      expect(response.body.status).toBe('PENDING');
      expect(response.body.isOverdue).toBe(false);
    });

    it('deve rejeitar demanda com descrição menor que 3 caracteres', async () => {
      const response = await supertest(app.getHttpServer()).post('/api/demands').send({
        description: 'Oi',
        responsible: 'Fulano',
        dueDate: '2026-10-20T18:00:00.000Z',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
    });

    it('deve rejeitar demanda com responsável ausente', async () => {
      const response = await supertest(app.getHttpServer()).post('/api/demands').send({
        description: 'Descrição válida',
        dueDate: '2026-10-20T18:00:00.000Z',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
    });

    it('deve rejeitar demanda com data inválida', async () => {
      const response = await supertest(app.getHttpServer()).post('/api/demands').send({
        description: 'Descrição válida',
        responsible: 'Fulano',
        dueDate: 'data-invalida',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation Error');
    });

    it('deve rejeitar demanda com status inexistente no enum', async () => {
      const response = await supertest(app.getHttpServer()).post('/api/demands').send({
        description: 'Descrição válida',
        responsible: 'Fulano',
        dueDate: '2026-10-20T18:00:00.000Z',
        status: 'EM_ANALISE',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/demands', () => {
    it('deve listar demandas com paginação e metadados', async () => {
      const response = await supertest(app.getHttpServer()).get('/api/demands?page=1&limit=5');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta).toHaveProperty('total');
      expect(response.body.meta).toHaveProperty('page', 1);
    });

    it('deve filtrar demandas por status', async () => {
      const response = await supertest(app.getHttpServer()).get('/api/demands?status=COMPLETED');
      expect(response.status).toBe(200);
      expect(response.body.data.every((d: any) => d.status === 'COMPLETED')).toBe(true);
    });

    it('deve filtrar demandas por responsável', async () => {
      const response = await supertest(app.getHttpServer()).get('/api/demands?responsible=Juliana');
      expect(response.status).toBe(200);
      expect(response.body.data.every((d: any) => d.responsible.includes('Juliana'))).toBe(true);
    });

    it('deve filtrar demandas por busca textual', async () => {
      const response = await supertest(app.getHttpServer()).get('/api/demands?search=dashboard');
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/demands/:id', () => {
    it('deve retornar 404 para ID inexistente', async () => {
      const response = await supertest(app.getHttpServer()).get('/api/demands/id-totalmente-inexistente');
      expect(response.status).toBe(404);
      expect(response.body.message).toContain('não encontrada');
    });

    it('deve retornar a demanda correta por ID', async () => {
      const list = await supertest(app.getHttpServer()).get('/api/demands?limit=1');
      const item = list.body.data[0];

      const response = await supertest(app.getHttpServer()).get(`/api/demands/${item.id}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(item.id);
      expect(response.body.description).toBe(item.description);
    });
  });

  describe('PUT /api/demands/:id', () => {
    it('deve atualizar os dados de uma demanda', async () => {
      const list = await supertest(app.getHttpServer()).get('/api/demands?limit=1');
      const item = list.body.data[0];

      const updatedData = {
        description: 'Descrição devidamente atualizada via NestJS',
        responsible: 'Novo Responsável NestJS',
      };

      const response = await supertest(app.getHttpServer())
        .put(`/api/demands/${item.id}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.description).toBe(updatedData.description);
      expect(response.body.responsible).toBe(updatedData.responsible);
    });
  });

  describe('PATCH /api/demands/:id/status', () => {
    it('deve alterar o status de uma demanda para COMPLETED', async () => {
      const list = await supertest(app.getHttpServer()).get('/api/demands?limit=1');
      const item = list.body.data[0];

      const response = await supertest(app.getHttpServer())
        .patch(`/api/demands/${item.id}/status`)
        .send({ status: 'COMPLETED' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('COMPLETED');
      expect(response.body.isOverdue).toBe(false); // Concluída nunca é atrasada
    });

    it('deve rejeitar status inválido', async () => {
      const list = await supertest(app.getHttpServer()).get('/api/demands?limit=1');
      const item = list.body.data[0];

      const response = await supertest(app.getHttpServer())
        .patch(`/api/demands/${item.id}/status`)
        .send({ status: 'STATUS_INVALIDO' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/demands/stats', () => {
    it('deve retornar métricas numéricas agregadas corretas', async () => {
      const response = await supertest(app.getHttpServer()).get('/api/demands/stats');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('pending');
      expect(response.body).toHaveProperty('inProgress');
      expect(response.body).toHaveProperty('completed');
      expect(response.body).toHaveProperty('overdue');
      expect(typeof response.body.total).toBe('number');
    });
  });
});
