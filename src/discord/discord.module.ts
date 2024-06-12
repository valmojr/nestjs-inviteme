import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';
import { NecordModule } from 'necord';
import { DiscordConfigService } from './discord.config.service';
import { DiscordUpdate } from './discord.update.service';
import { HouseService } from '../house/house.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventService } from '../event/event.service';
import { GroupService } from '../group/group.service';
import { RoleService } from '../role/role.service';

@Module({
  imports: [
    NecordModule.forRootAsync({
      useClass: DiscordConfigService,
    }),
  ],
  controllers: [DiscordController],
  providers: [
    DiscordService,
    DiscordUpdate,
    PrismaService,
    EventService,
    GroupService,
    RoleService,
    HouseService,
    UserService,
  ],
})
export class DiscordModule {}
