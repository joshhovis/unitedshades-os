import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { JobNotesService } from './job-notes.service';
import { createJobNoteSchema } from './dto/create-job-note.dto';

@Controller('job-notes')
export class JobNotesController {
  constructor(private readonly service: JobNotesService) {}

  @Post()
  create(@Body() body: unknown) {
    const parsed = createJobNoteSchema.parse(body);
    return this.service.create(parsed);
  }

  @Get()
  findAll(@Query('jobId') jobId?: string) {
    if (!jobId) return [];
    return this.service.findAll(jobId);
  }
}
