import { Module } from '@nestjs/common';
import { DemandController } from './demand.controller.js';
import { DemandService } from './demand.service.js';
import { DemandRepository } from './demand.repository.js';

@Module({
  controllers: [DemandController],
  providers: [DemandService, DemandRepository],
  exports: [DemandService],
})
export class DemandsModule {}
