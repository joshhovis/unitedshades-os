/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryItemDto } from './dto/create-item.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  createItem(dto: CreateInventoryItemDto) {
    return this.prisma.inventoryItem.create({
      data: {
        name: dto.name,
        sku: dto.sku ?? null,
        unit: dto.unit ?? 'each',
        reorderThreshold: dto.reorderThreshold ?? 0,
      },
    });
  }

  async listItems() {
    const items = await this.prisma.inventoryItem.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    // compute on-hand from movements
    const itemIds = items.map((i) => i.id);
    const movements = await this.prisma.inventoryMovement.findMany({
      where: { itemId: { in: itemIds } },
      select: { itemId: true, qtyChange: true },
    });

    const onHandMap = new Map<string, number>();
    for (const m of movements) {
      onHandMap.set(m.itemId, (onHandMap.get(m.itemId) ?? 0) + m.qtyChange);
    }

    return items.map((i) => ({
      ...i,
      onHand: onHandMap.get(i.id) ?? 0,
      belowThreshold: (onHandMap.get(i.id) ?? 0) <= i.reorderThreshold,
    }));
  }

  async getItem(id: string) {
    const item = await this.prisma.inventoryItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Inventory item not found');

    const agg = await this.prisma.inventoryMovement.aggregate({
      where: { itemId: id },
      _sum: { qtyChange: true },
    });

    const onHand = agg._sum.qtyChange ?? 0;

    return {
      ...item,
      onHand,
      belowThreshold: onHand <= item.reorderThreshold,
    };
  }

  async adjustStock(dto: AdjustStockDto) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id: dto.itemId },
      select: { id: true },
    });
    if (!item) throw new NotFoundException('Inventory item not found');

    if (dto.jobId) {
      const job = await this.prisma.job.findUnique({
        where: { id: dto.jobId },
        select: { id: true },
      });
      if (!job) throw new NotFoundException('Job not found');
    }

    return this.prisma.inventoryMovement.create({
      data: {
        itemId: dto.itemId,
        qtyChange: dto.qtyChange,
        reason: dto.reason,
        note: dto.note ?? null,
        jobId: dto.jobId ?? null,
      },
    });
  }

  listMovements(itemId?: string) {
    return this.prisma.inventoryMovement.findMany({
      where: itemId ? { itemId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { item: true, job: true },
    });
  }
}
