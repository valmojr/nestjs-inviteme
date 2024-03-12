import { Injectable } from '@nestjs/common';
import { IntentsBitField } from 'discord.js';
import { NecordModuleOptions } from 'necord';

@Injectable()
export class DiscordConfigService {
  createNecordOptions(): NecordModuleOptions {
    return {
      token: process.env.DISCORD_BOT_TOKEN,
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.DirectMessages,
      ],
    };
  }
}
