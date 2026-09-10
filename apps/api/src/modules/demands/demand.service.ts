import { Injectable, Inject } from '@nestjs/common';
import { Demand } from '@prisma/client';
import { DemandRepository } from './demand.repository.js';
import { CreateDemandInput, ListDemandsQuery, UpdateDemandInput, UpdateStatusInput } from './demand.schema.js';
import { DemandItem, DemandStats } from './demand.types.js';
import { NotFoundError } from '../../shared/errors/app-error.js';

@Injectable()
export class DemandService {
  constructor(@Inject(DemandRepository) private readonly repository: DemandRepository) {}

  /**
   * Determina dinamicamente se a demanda está vencida/atrasada:
   * dueDate < hoje E status != 'COMPLETED'
   */
  private enrichDemand(demand: Demand): DemandItem {
    const isOverdue = new Date(demand.dueDate) < new Date() && demand.status !== 'COMPLETED';

    return {
      id: demand.id,
      description: demand.description,
      responsible: demand.responsible,
      dueDate: demand.dueDate,
      status: demand.status,
      isOverdue,
      createdAt: demand.createdAt,
      updatedAt: demand.updatedAt,
    };
  }

  async create(data: CreateDemandInput): Promise<DemandItem> {
    const demand = await this.repository.create(data);
    return this.enrichDemand(demand);
  }

  async findById(id: string): Promise<DemandItem> {
    const demand = await this.repository.findById(id);
    if (!demand) {
      throw new NotFoundError(`Demanda com ID "${id}" não encontrada`);
    }
    return this.enrichDemand(demand);
  }

  async list(query: ListDemandsQuery): Promise<{ data: DemandItem[]; meta: { total: number; page: number; limit: number } }> {
    const { items, total } = await this.repository.findMany(query);
    return {
      data: items.map((item) => this.enrichDemand(item)),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
      },
    };
  }

  async update(id: string, data: UpdateDemandInput): Promise<DemandItem> {
    await this.findById(id); // Garante existência ou lança 404
    const updated = await this.repository.update(id, data);
    return this.enrichDemand(updated);
  }

  async updateStatus(id: string, { status }: UpdateStatusInput): Promise<DemandItem> {
    await this.findById(id); // Garante existência ou lança 404
    const updated = await this.repository.updateStatus(id, status);
    return this.enrichDemand(updated);
  }

  async getDistinctResponsibles(): Promise<string[]> {
    return this.repository.getDistinctResponsibles();
  }

  async getStats(): Promise<DemandStats> {
    return this.repository.getStats();
  }

  async getStatsByResponsible(): Promise<ResponsibleStats[]> {
    return this.repository.getStatsByResponsible();
  }
}
