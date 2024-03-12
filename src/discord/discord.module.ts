import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';
import { NecordModule } from 'necord';
import { DiscordConfigService } from './discord.config.service';

@Module({
  imports: [
    NecordModule.forRootAsync({
      useClass: DiscordConfigService,
    }),
  ],
  controllers: [DiscordController],
  providers: [DiscordService],
})
export class DiscordModule {}
