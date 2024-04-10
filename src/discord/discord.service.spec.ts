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
import { JwtService } from '@nestjs/jwt';
import { Guild } from 'discord.js';
import { BadRequestException } from '@nestjs/common';

describe('DiscordService', () => {
  let service: DiscordService;
  let houseService: HouseService;

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
          DiscordService,
          DiscordUpdate,
        ],
      })
    ).compile();

    service = module.get<DiscordService>(DiscordService);
    houseService = module.get<HouseService>(HouseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('guildCreator Tests', () => {
    it('should throw error if the the provided data is not valid', async () => {
      const invalidData: Guild = undefined;

      try {
        service.guildCreator(invalidData);
        expect(service).toThrowErrorMatchingSnapshot(
          'invalid guild information provided',
        );
      } catch (error) {
        expect(error).toMatchInlineSnapshot(
          'invalid guild information provided',
        );
      }
    });
    it('should be able to create a guild', async () => {
      houseService.create = jest
        .fn()
        .mockRejectedValueOnce(new BadRequestException());
    });
  });

  describe('guildDelete Tests', () => {
    it('should throw error if the the provided data is not valid', async () => {});
    it('should throw error if the the guild is not found', async () => {});
    it('should be able to delete a guild', async () => {});
  });
});
