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
    avatar: null,
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

  it('should find all users', async () => {
    const users = await service.findAll();

    expect(users).toBeInstanceOf(Array);
  });

  it('should find a user by id', async () => {
    const user = await service.findOne(testUser.id);

    expect(user).toHaveProperty('id');
  });

  it('should find a user by object', async () => {
    const user = await service.findOne(testUser);

    expect(user).toHaveProperty('id');
  });

  it('should update a user', async () => {
    const user = await service.update(testUser);

    expect(user).toHaveProperty('id');
    expect(user.username).toBe('Updated User');
    expect(user.updatedAt).not.toEqual(testUser.updatedAt);
  });

  it('should delete a user by id', async () => {
    const user = await service.remove(testUser.id);

    expect(user).toHaveProperty('id');
  });

  it('should delete a user by object', async () => {
    const user = await service.remove(testUser);

    expect(user).toHaveProperty('id');
  });
});
