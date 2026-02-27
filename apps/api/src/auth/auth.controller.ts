/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { JwtCookieGuard } from './jwt.guard';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const updateMeSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phoneRaw: z.string().min(1).optional().nullable(),
  timezone: z.string().min(1).optional(),
});

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('login')
  async login(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = loginSchema.parse(body);
    const { token, user } = await this.service.login(email, password);

    res.cookie('auth', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // dev
      path: '/',
    });

    return user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth', { path: '/' });
    return { ok: true };
  }

  @UseGuards(JwtCookieGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.service.me(req.user.id);
  }

  @UseGuards(JwtCookieGuard)
  @Patch('me')
  updateMe(@Req() req: any, @Body() body: unknown) {
    const data = updateMeSchema.parse(body);
    return this.service.updateMe(req.user.id, data);
  }
}
