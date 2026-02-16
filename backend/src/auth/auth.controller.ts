import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req: ExpressRequest) {
    return (req as any).user;
  }
}
