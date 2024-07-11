import { BadRequestException } from '@nestjs/common';
import { House } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Guild } from 'discord.js';

export default function GuildParser(guild: Guild, isPublic?: boolean): House {
  if (isPublic === undefined) {
    isPublic = false;
  }

  if (!guild?.id || !guild?.createdAt || !guild?.name) {
    throw new BadRequestException('invalid guild information provided');
  }

  return {
    id: randomUUID(),
    discordId: guild.id,
    createdAt: guild.createdAt,
    updatedAt: new Date(),
    name: guild.name,
    avatar: guild.iconURL(),
    banner: guild.bannerURL(),
    public: isPublic,
  };
}
