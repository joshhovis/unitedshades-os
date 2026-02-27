import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { JobLineItemsService } from './job-line-items.service';
import { createJobLineItemSchema } from './dto/create-job-line-item.dto';
import { updateJobLineItemSchema } from './dto/update-job-line-item.dto';

@Controller('job-line-items')
export class JobLineItemsController {
  constructor(private readonly service: JobLineItemsService) {}

  @Post()
  create(@Body() body: unknown) {
    const parsed = createJobLineItemSchema.parse(body);
    return this.service.create(parsed);
  }

  @Get()
  findAll(@Query('jobId') jobId?: string) {
    if (!jobId) return [];
    return this.service.findAll(jobId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    const parsed = updateJobLineItemSchema.parse(body);
    return this.service.update(id, parsed);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
