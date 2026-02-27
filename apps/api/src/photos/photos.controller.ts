import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { createUploadSchema } from './dto/create-upload.dto';
import type { JobPhoto } from '@prisma/client';

@Controller('photos')
export class PhotosController {
  constructor(private readonly service: PhotosService) {}

  @Post('upload-url')
  async createUpload(@Body() body: unknown) {
    const parsed = createUploadSchema.parse(body);
    return await this.service.createUpload(parsed);
  }

  @Get()
  async list(@Query('jobId') jobId?: string): Promise<JobPhoto[]> {
    if (!jobId) {
      return [];
    }

    const photos = await this.service.list(jobId);
    return photos;
  }
}
