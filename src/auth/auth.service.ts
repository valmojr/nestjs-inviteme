import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async signIn(user: { id: string; username: string; displayName: string }) {
    const userOnDatabase = await this.userService.findOne(user.id);

    if (!userOnDatabase) {
      throw new UnauthorizedException('user not found');
    } else {
      userOnDatabase.password = undefined;

      return userOnDatabase;
    }
  }
}
