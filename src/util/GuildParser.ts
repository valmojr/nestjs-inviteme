import { House } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Guild } from 'discord.js';
import { HouseService } from 'src/house/house.service';

export default function GuildParser(guild: Guild, isPublic?: boolean): House {
  if (isPublic === undefined) {
    isPublic = false;
  }

  return {
    id: randomUUID(),
    discordId: guild.id,
    createdAt: guild.createdAt,
    updatedAt: new Date(),
    name: guild.name,
    avatar: guild.iconURL(),
    public: isPublic,
  };
}

export async function GuildChecker(
  guild: Guild,
  houseService: HouseService,
): Promise<House | false> {
  const houseInDatabase = await houseService.findByDiscordId(guild.id);

  return houseInDatabase;
}
