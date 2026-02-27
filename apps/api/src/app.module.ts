import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CustomersModule } from './customers/customers.module';
import { JobsService } from './jobs/jobs.service';
import { JobsController } from './jobs/jobs.controller';
import { JobsModule } from './jobs/jobs.module';
import { VehiclesService } from './vehicles/vehicles.service';
import { VehiclesController } from './vehicles/vehicles.controller';
import { VehiclesModule } from './vehicles/vehicles.module';
import { JobLineItemsModule } from './job-line-items/job-line-items.module';
import { JobNotesModule } from './job-notes/job-notes.module';
import { PhotosModule } from './photos/photos.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, CustomersModule, JobsModule, VehiclesModule, JobLineItemsModule, JobNotesModule, PhotosModule, InventoryModule],
  controllers: [AppController, JobsController, VehiclesController],
  providers: [AppService, JobsService, VehiclesService],
})
export class AppModule {}
