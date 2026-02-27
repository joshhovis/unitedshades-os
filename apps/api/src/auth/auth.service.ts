/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = await this.jwt.signAsync(
      { sub: user.id },
      { secret: process.env.JWT_SECRET! },
    );
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneRaw: user.phoneRaw,
        timezone: user.timezone,
      },
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phoneRaw: true,
        timezone: true,
      },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }

  async updateMe(
    userId: string,
    data: {
      name?: string;
      email?: string;
      phoneRaw?: string | null;
      timezone?: string;
    },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name ?? undefined,
        email: data.email ?? undefined,
        phoneRaw: data.phoneRaw ?? undefined,
        timezone: data.timezone ?? undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneRaw: true,
        timezone: true,
      },
    });
  }
}
