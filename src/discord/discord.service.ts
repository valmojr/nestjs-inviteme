import { Injectable, Logger } from '@nestjs/common';
import { Event } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  Guild,
  GuildMember,
  PartialGuildMember,
  User as DiscordUser,
  GuildScheduledEvent,
} from 'discord.js';
import { EventService } from '../event/event.service';
import { GroupService } from '../group/group.service';
import { HouseService } from '../house/house.service';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';
import GuildParser from '../util/GuildParser';
import { DiscordUserParser } from '../util/UserParser';

@Injectable()
export class DiscordService {
  constructor(
    private readonly houseService: HouseService,
    private readonly userService: UserService,
    private readonly eventService: EventService,
    private readonly groupService: GroupService,
    private readonly roleService: RoleService,
  ) {}

  private readonly logger = new Logger(DiscordService.name);

  async guildCreator(guild: Guild) {
    this.logger.log(`Joined guild ${guild.name}`);

    const house = GuildParser(guild);

    return await this.houseService.upsertByDiscord(house);
  }

  async guildDelete(guild: Guild) {
    this.logger.log(`Left guild ${guild.name}`);

    return await this.houseService.removeByDiscordId(guild.id);
  }

  async guildMemberAdd(member: DiscordUser, guild: Guild) {
    const userOnDatabase = await DiscordUserParser(member, this.userService);
    const house = GuildParser(guild);

    return await this.houseService.addUser(userOnDatabase, house.discordId);
  }

  async guildMemberRemove(member: GuildMember | PartialGuildMember) {
    this.logger.log(`User left guild ${member.guild.name}`);

    const discordUser = member.user;

    const user = await DiscordUserParser(discordUser, this.userService);

    const guild = member.guild;

    const house = GuildParser(guild);

    const userOnDatabase = await this.userService.findByDiscordId(
      user.discordId,
    );

    const updatedUser = await this.userService.upsert({
      id: userOnDatabase.id,
      ...user,
    });

    return await this.houseService.removeUser(updatedUser, house);
  }

  public async DiscordEventCreation(guildScheduledEvent: GuildScheduledEvent) {
    let role = await this.roleService.create({
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Owner',
      userId: guildScheduledEvent.creatorId,
      groupID: null,
      eventID: null,
    });

    let group = await this.groupService.create({
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      fatherGroupID: null,
      eventID: null,
      name: 'main',
      roleIDs: [],
    });

    role = await this.roleService.update({ ...role, groupID: group.id });
    group = await this.groupService.update({ ...group, roleIDs: [role.id] });

    const event: Event = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      name: guildScheduledEvent.name,
      mainGroupID: group.id,
      location: guildScheduledEvent.channelId,
      description: guildScheduledEvent.description,
      endDate: guildScheduledEvent.scheduledEndAt,
      ownerID: guildScheduledEvent.creatorId,
      startDate: guildScheduledEvent.scheduledStartAt,
      thumbnail: guildScheduledEvent.image,
      public: false,
    };

    return await this.eventService.create(event);
  }
}
