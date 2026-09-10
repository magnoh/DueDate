import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Demand, DemandStatus, Prisma } from '@prisma/client';
import { CreateDemandInput, ListDemandsQuery, UpdateDemandInput } from './demand.schema.js';

@Injectable()
export class DemandRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(data: CreateDemandInput): Promise<Demand> {
    return this.prisma.demand.create({
      data: {
        description: data.description,
        responsible: data.responsible,
        dueDate: data.dueDate,
        status: data.status,
      },
    });
  }

  async findById(id: string): Promise<Demand | null> {
    return this.prisma.demand.findUnique({
      where: { id },
    });
  }

  async findMany(filters: ListDemandsQuery): Promise<{ items: Demand[]; total: number }> {
    const where: Prisma.DemandWhereInput = {};

    if (filters.status) {
      where.status = filters.status as DemandStatus;
    }

    if (filters.isOverdue === true) {
      where.dueDate = { lt: new Date() };
      if (!filters.status) {
        where.status = { not: 'COMPLETED' };
      }
    } else if (filters.isOverdue === false) {
      // either not past due or completed
      where.OR = [
        { dueDate: { gte: new Date() } },
        { status: 'COMPLETED' },
      ];
    }

    if (filters.responsible) {
      where.responsible = {
        contains: filters.responsible,
        mode: 'insensitive',
      };
    }

    if (filters.search) {
      where.OR = [
        {
          description: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          responsible: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const skip = (filters.page - 1) * filters.limit;

    const [items, total] = await Promise.all([
      this.prisma.demand.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.demand.count({ where }),
    ]);

    return { items, total };
  }

  async update(id: string, data: UpdateDemandInput): Promise<Demand> {
    return this.prisma.demand.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: DemandStatus): Promise<Demand> {
    return this.prisma.demand.update({
      where: { id },
      data: { status },
    });
  }

  async getDistinctResponsibles(): Promise<string[]> {
    const records = await this.prisma.demand.findMany({
      select: { responsible: true },
      distinct: ['responsible'],
      orderBy: { responsible: 'asc' },
    });
    return records.map((r) => r.responsible);
  }

  async getStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
  }> {
    const now = new Date();

    const [total, pending, inProgress, completed, overdue] = await Promise.all([
      this.prisma.demand.count(),
      this.prisma.demand.count({ where: { status: 'PENDING' } }),
      this.prisma.demand.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.demand.count({ where: { status: 'COMPLETED' } }),
      this.prisma.demand.count({
        where: {
          dueDate: { lt: now },
          status: { not: 'COMPLETED' },
        },
      }),
    ]);

    return { total, pending, inProgress, completed, overdue };
  }

  async getStatsByResponsible(): Promise<{
    responsible: string;
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  }[]> {
    const records = await this.prisma.demand.groupBy({
      by: ['responsible', 'status'],
      _count: {
        _all: true,
      },
    });

    const map = new Map<
      string,
      {
        responsible: string;
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
      }
    >();

    for (const r of records) {
      if (!map.has(r.responsible)) {
        map.set(r.responsible, {
          responsible: r.responsible,
          total: 0,
          pending: 0,
          inProgress: 0,
          completed: 0,
        });
      }
      const entry = map.get(r.responsible)!;
      const count = r._count._all;
      entry.total += count;
      if (r.status === 'PENDING') entry.pending += count;
      else if (r.status === 'IN_PROGRESS') entry.inProgress += count;
      else if (r.status === 'COMPLETED') entry.completed += count;
    }

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }
}
