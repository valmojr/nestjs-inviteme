import {
  Post,
  HttpCode,
  Body,
  Controller,
  HttpStatus,
  Get,
  Req,
  Param,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() user: { id: string; username: string; displayName: string },
  ) {
    return await this.authService.signIn(user);
  }

  @Get('me')
  async me(@Req() req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    return await this.authService.getMe(token);
  }

  @Post('discord/:code')
  async discordLogin(
    @Param('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.discordOAuthCallback(code, res);
  }
}
