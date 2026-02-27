import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobLineItemDto } from './dto/create-job-line-item.dto';
import { UpdateJobLineItemDto } from './dto/update-job-line-item.dto';

@Injectable()
export class JobLineItemsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateJobLineItemDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: data.jobId },
      select: { id: true },
    });
    if (!job) throw new NotFoundException('Job not found');

    const totalCents = data.qty * data.unitPriceCents;

    const item = await this.prisma.jobLineItem.create({
      data: {
        jobId: data.jobId,
        description: data.description,
        qty: data.qty,
        unitPriceCents: data.unitPriceCents,
        totalCents,
      },
    });

    await this.recalcJobTotals(data.jobId);

    return item;
  }

  findAll(jobId: string) {
    return this.prisma.jobLineItem.findMany({
      where: { jobId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: string, patch: UpdateJobLineItemDto) {
    const existing = await this.prisma.jobLineItem.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Line item not found');

    const qty = patch.qty ?? existing.qty;
    const unit = patch.unitPriceCents ?? existing.unitPriceCents;
    const totalCents = qty * unit;

    const updated = await this.prisma.jobLineItem.update({
      where: { id },
      data: {
        description: patch.description ?? undefined,
        qty: patch.qty ?? undefined,
        unitPriceCents: patch.unitPriceCents ?? undefined,
        totalCents,
      },
    });

    await this.recalcJobTotals(existing.jobId);

    return updated;
  }

  async remove(id: string) {
    const existing = await this.prisma.jobLineItem.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Line item not found');

    await this.prisma.jobLineItem.delete({ where: { id } });
    await this.recalcJobTotals(existing.jobId);

    return { ok: true };
  }

  private async recalcJobTotals(jobId: string) {
    const agg = await this.prisma.jobLineItem.aggregate({
      where: { jobId },
      _sum: { totalCents: true },
    });

    const subtotal = agg._sum.totalCents ?? 0;
    const tax = 0; // keep 0 for now; add tax rules later
    const total = subtotal + tax;

    await this.prisma.job.update({
      where: { id: jobId },
      data: {
        subtotalCents: subtotal,
        taxCents: tax,
        totalCents: total,
      },
    });
  }
}
