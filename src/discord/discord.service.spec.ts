import { TestingModule } from '@nestjs/testing';
import { DiscordService } from './discord.service';
import { EventService } from '../event/event.service';
import { HouseService } from '../house/house.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { GroupService } from '../group/group.service';
import TestModuleBuilder from '../../test/test.module';
import { DiscordController } from './discord.controller';
import { DiscordUpdate } from './discord.update.service';
import { NecordModule } from 'necord';
import { DiscordConfigService } from './discord.config.service';

describe('DiscordService', () => {
  let service: DiscordService;

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
          DiscordService,
          DiscordUpdate,
        ],
      })
    ).compile();

    service = module.get<DiscordService>(DiscordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
