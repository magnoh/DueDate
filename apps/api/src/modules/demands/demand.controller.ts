import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UsePipes,
  Inject,
} from '@nestjs/common';
import { DemandService } from './demand.service.js';
import {
  createDemandSchema,
  listDemandsQuerySchema,
  updateDemandSchema,
  updateStatusSchema,
} from './demand.schema.js';
import type {
  CreateDemandInput,
  ListDemandsQuery,
  UpdateDemandInput,
  UpdateStatusInput,
} from './demand.schema.js';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe.js';

@Controller('api/demands')
export class DemandController {
  constructor(@Inject(DemandService) private readonly service: DemandService) {}

  @Get('stats')
  async getStats() {
    return this.service.getStats();
  }

  @Get('stats/by-responsible')
  async getStatsByResponsible() {
    const data = await this.service.getStatsByResponsible();
    return { data };
  }

  @Get('responsibles')
  async getResponsibles() {
    const responsibles = await this.service.getDistinctResponsibles();
    return { data: responsibles };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createDemandSchema))
  async create(@Body() data: CreateDemandInput) {
    return this.service.create(data);
  }

  @Get()
  async list(@Query(new ZodValidationPipe(listDemandsQuerySchema)) query: ListDemandsQuery) {
    return this.service.list(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateDemandSchema)) data: UpdateDemandInput,
  ) {
    return this.service.update(id, data);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStatusSchema)) data: UpdateStatusInput,
  ) {
    return this.service.updateStatus(id, data);
  }
}
