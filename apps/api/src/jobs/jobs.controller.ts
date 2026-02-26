import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { createJobSchema } from './dto/create-job.dto';
import { updateJobSchema } from './dto/update-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() body: unknown) {
    const parsed = createJobSchema.parse(body);
    return this.jobsService.create(parsed);
  }

  @Get()
  findAll(@Query('customerId') customerId?: string) {
    return this.jobsService.findAll(customerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    const parsed = updateJobSchema.parse(body);
    return this.jobsService.update(id, parsed);
  }
}
