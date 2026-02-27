import { Module } from '@nestjs/common';
import { JobLineItemsController } from './job-line-items.controller';
import { JobLineItemsService } from './job-line-items.service';

@Module({
  controllers: [JobLineItemsController],
  providers: [JobLineItemsService]
})
export class JobLineItemsModule {}
