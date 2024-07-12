import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';
import { NecordModule } from 'necord';
import { DiscordConfigService } from './discord.config.service';
import { DiscordUpdate } from './discord.update.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventModule } from 'src/event/event.module';
import { UserModule } from 'src/user/user.module';
import { HouseModule } from 'src/house/house.module';
import { GroupModule } from 'src/group/group.module';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    NecordModule.forRootAsync({
      useClass: DiscordConfigService,
    }),
    PrismaModule,
    UserModule,
    HouseModule,
    EventModule,
    // TODO - Remove this
    GroupModule,
    RoleModule,
  ],
  controllers: [DiscordController],
  providers: [DiscordService, DiscordUpdate],
})
export class DiscordModule {}
