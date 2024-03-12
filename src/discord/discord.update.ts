import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'discord.js';
import { Context, ContextOf, On, Once } from 'necord';

@Injectable()
export class DiscordUpdate {
  private readonly logger = new Logger(DiscordUpdate.name);

  public constructor(private readonly client: Client) {
    this.logger.warn(process.env.DISCORD_BOT_TOKEN);
  }

  @Once('ready')
  public onReady() {
    this.logger.log(`Logged in as ${this.client.user.username}`);
  }

  @On('warn')
  public onWarn(@Context() [message]: ContextOf<'warn'>) {
    this.logger.warn(message);
  }
}
