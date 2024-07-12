import { Controller, UseGuards } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { BearerGuard } from '../auth/bearer.guard';
import { DiscordUpdate } from './discord.update.service';

@UseGuards(BearerGuard)
@Controller('discord')
export class DiscordController {
  constructor(
    private readonly discordService: DiscordService,
    private readonly discordUpdate: DiscordUpdate,
  ) {}
}
