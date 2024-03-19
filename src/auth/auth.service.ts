import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User as DiscordUser } from 'discord.js';
import { DiscordAccessToken } from 'src/util/AccessToken';
import { Response } from 'express';
import { DiscordUserParser } from '../util/UserParser';

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

  async discordOAuthCallback(code: string, response: Response) {
    let token: DiscordAccessToken;
    let user: DiscordUser;

    const api_url = 'https://discord.com/api/oauth2/token';
    const body = new URLSearchParams();
    body.append('client_id', process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '');
    body.append('client_secret', process.env.DISCORD_CLIENT_SECRET || '');
    body.append('grant_type', 'authorization_code');
    body.append('code', code);
    body.append(
      'redirect_uri',
      process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || '',
    );
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    try {
      const response = await fetch(api_url, {
        method: 'POST',
        headers,
        body,
      });

      token = (await response.json()) as DiscordAccessToken;
    } catch (error) {
      throw new BadRequestException(`Failed to get access token: ${error}`);
    }
    try {
      const response = await fetch('https://discord.com/api/users/@me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.access_token}`,
        },
      });
      user = (await response.json()) as DiscordUser;
    } catch (error) {
      throw new BadRequestException(`Failed to get user: ${error}`);
    }

    const userOnDatabase = await DiscordUserParser(user, this.userService);
    const jwtToken = this.jwtService.sign({ user });

    return response
      .cookie('token', jwtToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json({ user: userOnDatabase })
      .send();
  }
}
