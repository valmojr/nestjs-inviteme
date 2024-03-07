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

  async discordOAuthCallback(code: string) {
    let token: {
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
      scope: string;
    };

    try {
      const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI,
        }),
      });
      this.logger.log('response', JSON.stringify(response));

      token = await response.json();
    } catch (error) {
      throw new Error(`Failed to get access token: ${error}`);
    }
    try {
      const response = await fetch('https://discord.com/api/users/@me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access_token}`,
        },
      });

      const user = await response.json();
      this.logger.log('user', user);

      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error}`);
    }
  }
}
