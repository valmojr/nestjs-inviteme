import { TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import TestModuleBuilder from '../../test/test.module';
import { randomUUID } from 'crypto';
import { User } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const testUser: User = {
    id: randomUUID(),
    discordId: '1234567890',
    createdAt: new Date(),
    updatedAt: new Date(),
    username: 'Test User',
    displayName: 'Test User',
    password: null,
    avatarId: null,
    email: null,
    bannerColor: null,
    banner: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await (
      await TestModuleBuilder({
        providers: [PrismaService, UserService],
      })
    ).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);

    prisma.user.create = jest.fn().mockResolvedValue(testUser);
    prisma.user.findUnique = jest.fn().mockResolvedValue(testUser);
    prisma.user.findMany = jest.fn().mockResolvedValue([testUser]);
    prisma.user.update = jest.fn().mockResolvedValue({
      ...testUser,
      username: 'Updated User',
      updatedAt: new Date(),
    });
    prisma.user.upsert = jest.fn().mockResolvedValue(testUser);
    prisma.user.delete = jest.fn().mockResolvedValue({
      ...testUser,
      username: 'Removed User',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = await service.create(testUser);

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a user if nothing is provided', async () => {
    try {
      const user = await service.create(null);

      expect(user).not.toBeDefined();
    } catch (error) {
      expect(error.message).toContain('User is required');
    }
  });

  it('should find all users', async () => {
    const users = await service.findAll();

    expect(users).toBeInstanceOf(Array);
  });

  it('should be able to find users by string of names', async () => {
    const users = await service.findPartial('test');

    expect(users).toBeInstanceOf(Array);
    expect(users).toContain(testUser);
  });

  it('should not be able to find users by string of names if nothing is provided', async () => {
    try {
      const users = await service.findPartial(null);

      expect(users).not.toBeDefined();
    } catch (error) {
      expect(error.message).toContain('must have some string to search for');
    }
  });

  it('should find a user by id', async () => {
    const user = await service.findOne(testUser.id);

    expect(user).toHaveProperty('id');
  });

  it('should find a user by object', async () => {
    const user = await service.findOne(testUser);

    expect(user).toHaveProperty('id');
  });
  it('should not find a user by id if nothing is provided', async () => {
    try {
      const user = await service.findOne(null);

      expect(user).not.toBeDefined();
    } catch (error) {
      expect(error.message).toContain('data is required');
    }
  });

  it('should be able to find a user by discord id', async () => {
    const user = await service.findByDiscordId('discordId');

    expect(user).toBeDefined();
    expect(user).toEqual(testUser);
  });

  it('should not find a user by discord id if nothing is provided', async () => {
    try {
      const user = await service.findByDiscordId(null);

      expect(user).not.toBeDefined();
    } catch (error) {
      expect(error.message).toContain('Discord ID is required');
    }
  });

  it('should update a user', async () => {
    const user = await service.update(testUser);

    expect(user).toHaveProperty('id');
    expect(user.username).toBe('Updated User');
    expect(user.updatedAt).not.toEqual(testUser.updatedAt);
  });

  it('should not update a user if nothing is provided', async () => {
    try {
      const user = await service.update(null);

      expect(user).not.toBeDefined();
    } catch (error) {
      expect(error.message).toContain('User is required');
    }
  });

  it('should upsert users if not found on database', async () => {
    const user = await service.upsert(testUser);

    expect(user).toEqual(testUser);

    prisma.user.upsert = jest.fn().mockResolvedValueOnce({
      ...testUser,
      username: 'updatedUser',
    });

    const updatedUser = await service.upsert(testUser);

    expect(updatedUser.username).not.toEqual(user.username);
  });

  it('should upsert by discord id if not found on database', async () => {
    const user = await service.upsertByDiscord({
      ...testUser,
      discordId: null,
    });

    expect(user).toEqual(testUser);

    prisma.user.upsert = jest.fn().mockResolvedValueOnce({
      ...testUser,
      discordId: 'updatedUser',
    });

    const updatedUser = await service.upsertByDiscord(testUser);

    expect(updatedUser.discordId).not.toEqual(user.discordId);
  });

  it('should delete a user by id', async () => {
    const user = await service.remove(testUser.id);

    expect(user).toHaveProperty('id');
  });

  it('should delete a user by object', async () => {
    const user = await service.remove(testUser);

    expect(user).toHaveProperty('id');
  });

  it('should not delete a user by object if nothing is provided', async () => {
    try {
      const user = await service.remove(null);

      expect(user).not.toBeDefined();
    } catch (error) {
      expect(error.message).toContain('User is required');
    }
  });
});
