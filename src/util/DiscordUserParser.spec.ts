import { UserService } from '../user/user.service';
import { DiscordUserParser } from './DiscordUserParser';
import { randomUUID } from 'crypto';
import { User } from '@prisma/client';
import { TestingModule } from '@nestjs/testing';
import TestModuleBuilder from '../../test/test.module';
import { PrismaService } from '../prisma/prisma.service';

describe('DiscordUserParser function tests', () => {
  const mockDatabaseUser: User = {
    id: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    username: 'test_user',
    discordId: '1234567890',
    displayName: 'Test User',
    avatarId: 'avatarId',
    email: 'abc@def.com',
    password: 'secret_hashed_password',
    bannerColor: 'bannerColor',
    banner: 'banner',
  };

  const mockDiscordUser: any = {
    id: mockDatabaseUser.discordId,
    username: mockDatabaseUser.username,
    displayName: mockDatabaseUser.displayName,
    banner_color: mockDatabaseUser.bannerColor,
    banner: mockDatabaseUser.banner,
    avatar: mockDatabaseUser.avatarId,
  };

  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await (
      await TestModuleBuilder({
        providers: [PrismaService, UserService],
      })
    ).compile();

    userService = module.get<UserService>(UserService);

    userService.findByDiscordId = jest.fn().mockResolvedValue(mockDatabaseUser);
    userService.upsertByDiscord = jest.fn().mockResolvedValue(mockDatabaseUser);
  });

  it('should be defined', async () => {
    expect(DiscordUserParser).toBeDefined();
  });

  it('should return a valid user if discord user info is ok', async () => {
    const user = await DiscordUserParser(mockDiscordUser, userService);

    expect(user).toBeDefined();
    expect(user.discordId).toEqual(mockDiscordUser.id);
  });

  it('should upsert user on database if the user is not found', async () => {
    userService.findByDiscordId = jest.fn().mockReturnValue(null);

    const user = await DiscordUserParser(mockDiscordUser, userService);

    expect(user).toHaveProperty('id');
  });
});
