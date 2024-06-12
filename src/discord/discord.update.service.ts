import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'discord.js';
import { Context, ContextOf, On, Once } from 'necord';
import { DiscordService } from './discord.service';

@Injectable()
export class DiscordUpdate {
  private readonly logger = new Logger(DiscordUpdate.name);

  public constructor(
    private readonly client: Client,
    private readonly discordService: DiscordService,
  ) {}

  @Once('ready')
  public onReady() {
    this.logger.log(`Logged in as ${this.client.user.username}`);
  }

  @On('warn')
  public async onWarn(@Context() [message]: ContextOf<'warn'>) {
    this.logger.warn(message);
  }

  @On('guildCreate')
  public async onGuildCreate(@Context() [guild]: ContextOf<'guildCreate'>) {
    this.discordService.guildCreator(guild);

    const guildMembers = (await guild.members.fetch())
      .filter((guildMember) => guildMember.user.bot === false)
      .map((guildMember) => guildMember.user);

    return guildMembers.map(async (user) => {
      return await this.discordService.guildMemberAdd(user, guild);
    });
  }

  @On('guildDelete')
  public async onGuildDelete(@Context() [guild]: ContextOf<'guildDelete'>) {
    this.discordService.guildDelete(guild);
  }

  @On('guildMemberAdd')
  public onUserJoinGuild(@Context() [member]: ContextOf<'guildMemberAdd'>) {
    this.discordService.guildMemberAdd(member.user, member.guild);
  }

  @On('guildMemberRemove')
  public onUserLeftGuild(@Context() [member]: ContextOf<'guildMemberRemove'>) {
    this.logger.log(`${member.nickname} left the guild ${member.guild.name}`);
    this.discordService.guildMemberRemove(member);
  }

  @On('guildScheduledEventCreate')
  public async onDiscordUserEventCreate(
    @Context() [event]: ContextOf<'guildScheduledEventCreate'>,
  ) {
    this.discordService.DiscordEventCreation(event);
  }

  @On('guildScheduledEventDelete')
  public async onDiscordUserEventDelete(
    @Context() context: ContextOf<'guildScheduledEventDelete'>,
  ) {
    this.logger.log(JSON.stringify(context));
  }

  @On('guildScheduledEventUpdate')
  public async onDiscordUserEventUpdate(
    @Context() context: ContextOf<'guildScheduledEventUpdate'>,
  ) {
    this.logger.log(JSON.stringify(context));
  }
}
