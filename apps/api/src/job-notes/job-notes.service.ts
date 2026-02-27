import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobNoteDto } from './dto/create-job-note.dto';

@Injectable()
export class JobNotesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateJobNoteDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: data.jobId },
      select: { id: true },
    });
    if (!job) throw new NotFoundException('Job not found');

    return this.prisma.jobNote.create({
      data: {
        jobId: data.jobId,
        content: data.content,
      },
    });
  }

  findAll(jobId: string) {
    return this.prisma.jobNote.findMany({
      where: { jobId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
