import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateJobDto) {
    // verify customer exists (simple guard)
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
      select: { id: true },
    });
    if (!customer) throw new NotFoundException('Customer not found');

    return this.prisma.job.create({
      data: {
        customerId: data.customerId,
        vehicleId: data.vehicleId ?? null,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        notes: data.notes ?? null,
      },
      include: { customer: true, vehicle: true },
    });
  }

  findAll(customerId?: string) {
    return this.prisma.job.findMany({
      where: customerId ? { customerId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { customer: true, vehicle: true },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        customer: true,
        vehicle: true,
        lineItems: true,
        jobNotes: true,
        photos: true,
      },
    });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async update(id: string, patch: UpdateJobDto) {
    // ensure exists
    const exists = await this.prisma.job.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Job not found');

    return this.prisma.job.update({
      where: { id },
      data: {
        status: patch.status,
        scheduledAt:
          patch.scheduledAt === undefined
            ? undefined
            : patch.scheduledAt === null
              ? null
              : new Date(patch.scheduledAt),
        completedAt:
          patch.completedAt === undefined
            ? undefined
            : patch.completedAt === null
              ? null
              : new Date(patch.completedAt),
        notes: patch.notes === undefined ? undefined : patch.notes,
      },
      include: { customer: true, vehicle: true },
    });
  }
}
