import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { User as DiscordUser } from 'discord.js';
import { UserService } from 'src/user/user.service';

export default function UserParser(token: string, jwtService: JwtService) {
  const fetchedUser = jwtService.verify(token) as User;

  if (!fetchedUser) {
    throw new UnauthorizedException('user not parsed');
  }

  return fetchedUser;
}

export async function DiscordUserParser(
  discordUser: DiscordUser & { banner_color?: string },
  userService: UserService,
): Promise<User> {
  const userOnDatabase = await userService.findByDiscordId(discordUser.id);
  console.log(`User on database => ${userOnDatabase}`);

  return await userService.upsertByDiscord({
    id: userOnDatabase?.id || `${randomUUID()}`,
    createdAt: userOnDatabase?.createdAt || new Date(),
    updatedAt: new Date(),
    discordId: discordUser.id,
    username: discordUser.username,
    displayName: discordUser.displayName,
    bannerColor: discordUser?.banner_color,
    banner: discordUser.banner
      ? `https://cdn.discordapp.com/banners/${discordUser.id}/${discordUser.banner}.png`
      : null,
    avatar: discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : null,
    email: userOnDatabase?.email || null,
    password: userOnDatabase?.password || null,
  });
}
