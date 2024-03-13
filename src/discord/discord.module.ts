import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';
import { NecordModule } from 'necord';
import { DiscordConfigService } from './discord.config.service';
import { DiscordUpdate } from './discord.update';
import { HouseService } from 'src/house/house.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventService } from 'src/event/event.service';
import { GroupService } from 'src/group/group.service';
import { RoleService } from 'src/role/role.service';

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
