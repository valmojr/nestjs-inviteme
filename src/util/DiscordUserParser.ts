import { User as DiscordUser } from 'discord.js';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { UserService } from 'src/user/user.service';

export async function DiscordUserParser(
  discordUser: DiscordUser & { banner_color?: string },
  userService: UserService,
): Promise<User> {
  const userOnDatabase = await userService.findByDiscordId(discordUser.id);

  return await userService.upsertByDiscord({
    id: userOnDatabase?.id || `${randomUUID()}`,
    discordId: discordUser.id,
    username: discordUser.username,
    displayName: discordUser.displayName,
    bannerColor: discordUser?.banner_color,
    banner: discordUser.banner
      ? `https://cdn.discordapp.com/banners/${discordUser.id}/${discordUser.banner}.png`
      : null,
    avatarId: discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : null,
    email: userOnDatabase?.email || null,
    password: userOnDatabase?.password || null,
  });
}
