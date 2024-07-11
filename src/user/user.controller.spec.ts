import { TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import TestModuleBuilder from '../../test/test.module';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const testUser: User = {
    id: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    username: 'test_user',
    discordId: '1234567890',
    displayName: 'Test User',
    avatarId: null,
    email: null,
    password: null,
    bannerColor: null,
    banner: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await (
      await TestModuleBuilder({
        controllers: [UserController],
        providers: [PrismaService, UserService],
      })
    ).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);

    service.create = jest.fn().mockResolvedValueOnce(testUser);
    service.findAll = jest.fn().mockResolvedValueOnce([testUser]);
    service.findPartial = jest.fn().mockResolvedValueOnce([testUser]);
    service.findOne = jest.fn().mockResolvedValueOnce(testUser);
    service.update = jest.fn().mockResolvedValueOnce({
      ...testUser,
      updatedAt: new Date(),
      username: 'updated_user',
    });
    service.remove = jest.fn().mockResolvedValueOnce({
      ...testUser,
      username: 'deleted_user',
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to create a user', async () => {
    const user = await controller.create(testUser);

    expect(user).toBeDefined();
  });

  it('should be able to find a user by part of it', async () => {
    const users = await controller.findPartial('user');

    expect(users).toBeInstanceOf(Array);
    expect(users).toContain(testUser);
  });

  it('should be able to findAll users', async () => {
    const users = await controller.findAll();

    expect(users).toBeDefined();
  });

  it('should be able to find a user', async () => {
    const user = await controller.findOne(testUser.id);

    expect(user).toBeDefined();
  });

  it('should be able to update a user by id', async () => {
    const user = await controller.updateById(testUser.id, testUser);

    expect(user).toBeDefined();
    expect(user.username).toBe('updated_user');
  });

  it('should be able to update a user by object', async () => {
    const user = await controller.update(testUser);

    expect(user).toBeDefined();
    expect(user.username).toBe('updated_user');
  });

  it('should be able to remove a user by id', async () => {
    const user = await controller.removeById(testUser.id);

    expect(user).toBeDefined();
    expect(user.username).toBe('deleted_user');
  });

  it('should be able to remove a user by object', async () => {
    const user = await controller.remove(testUser);

    expect(user).toBeDefined();
    expect(user.username).toBe('deleted_user');
  });
});
