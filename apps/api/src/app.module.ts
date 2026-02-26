import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CustomersModule } from './customers/customers.module';
import { JobsService } from './jobs/jobs.service';
import { JobsController } from './jobs/jobs.controller';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, CustomersModule, JobsModule],
  controllers: [AppController, JobsController],
  providers: [AppService, JobsService],
})
export class AppModule {}
