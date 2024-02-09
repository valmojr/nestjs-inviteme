import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async signIn(user: { id: string; username: string; displayName: string }) {
    const userOnDatabase = await this.userService.findById(user.id);

    if (!userOnDatabase) {
      throw new HttpException('User not found', 404);
    } else {
      const { password, ...result } = userOnDatabase;
      return result;
    }
  }
}
