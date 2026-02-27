import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateVehicleDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
      select: { id: true },
    });
    if (!customer) throw new NotFoundException('Customer not found');

    return this.prisma.vehicle.create({
      data: {
        customerId: data.customerId,
        year: data.year ?? null,
        make: data.make ?? null,
        model: data.model ?? null,
        trim: data.trim ?? null,
        vin: data.vin ?? null,
        notes: data.notes ?? null,
      },
    });
  }

  findAll(customerId?: string) {
    return this.prisma.vehicle.findMany({
      where: customerId ? { customerId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async update(id: string, patch: UpdateVehicleDto) {
    const exists = await this.prisma.vehicle.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Vehicle not found');

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        year: patch.year === undefined ? undefined : patch.year,
        make: patch.make === undefined ? undefined : patch.make,
        model: patch.model === undefined ? undefined : patch.model,
        trim: patch.trim === undefined ? undefined : patch.trim,
        vin: patch.vin === undefined ? undefined : patch.vin,
        notes: patch.notes === undefined ? undefined : patch.notes,
      },
    });
  }
}
