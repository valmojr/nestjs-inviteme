import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async signIn(user: { id: string; username: string; displayName: string }) {
    const userOnDatabase = await this.userService.findOne(user.id);

    if (!userOnDatabase) {
      throw new UnauthorizedException('user not found');
    } else {
      userOnDatabase.password = undefined;

      return userOnDatabase;
    }
  }

  async getMe(token: string) {
    const user = await this.jwtService.verify(token);
    const userOnDatabase = await this.userService.findOne(user);

    if (userOnDatabase) {
      this.logger.log(`User ${userOnDatabase.username} checked his identity`);
      return userOnDatabase;
    } else {
      return false;
    }
  }
}
