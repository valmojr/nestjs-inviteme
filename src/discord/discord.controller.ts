import { Controller, UseGuards } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { DiscordUpdate } from './discord.update.service';

@UseGuards(AuthGuard)
@Controller('discord')
export class DiscordController {
  constructor(
    private readonly discordService: DiscordService,
    private readonly discordUpdate: DiscordUpdate,
  ) {}
}
