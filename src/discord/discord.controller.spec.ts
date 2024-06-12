import { TestingModule } from '@nestjs/testing';
import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';
import { HouseService } from '../house/house.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { GroupService } from '../group/group.service';
import { EventService } from '../event/event.service';
import TestModuleBuilder from '../../test/test.module';
import { NecordModule } from 'necord';
import { DiscordConfigService } from './discord.config.service';
import { JwtService } from '@nestjs/jwt';
import { DiscordUpdate } from './discord.update.service';

describe('DiscordController', () => {
  let controller: DiscordController;

  beforeEach(async () => {
    const module: TestingModule = await (
      await TestModuleBuilder({
        imports: [
          NecordModule.forRootAsync({
            useClass: DiscordConfigService,
          }),
        ],
        controllers: [DiscordController],
        providers: [
          PrismaService,
          HouseService,
          UserService,
          RoleService,
          GroupService,
          EventService,
          JwtService,
          DiscordUpdate,
          DiscordService,
        ],
      })
    ).compile();

    controller = module.get<DiscordController>(DiscordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
