import { Post, HttpCode, Body, Controller, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() user: { id: string; username: string; displayName: string }) {
    return this.authService.signIn(user);
  }
}
