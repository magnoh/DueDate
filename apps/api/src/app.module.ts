import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { DemandsModule } from './modules/demands/demands.module.js';
import { AppController } from './app.controller.js';

@Module({
  imports: [PrismaModule, DemandsModule],
  controllers: [AppController],
})
export class AppModule {}
