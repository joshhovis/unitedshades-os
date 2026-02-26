import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('/health')
  health() {
    return { ok: true };
  }

  @Get('/health/db')
  async healthDb() {
    // Cheap query — just prove DB is reachable
    const result = await this.prisma.role.findMany({ take: 1 });
    return { ok: true, roleCountSample: result.length };
  }
}
