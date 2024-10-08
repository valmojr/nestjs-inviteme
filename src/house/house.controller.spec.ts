import { TestingModule } from '@nestjs/testing';
import { HouseController } from './house.controller';
import { HouseService } from './house.service';
import { PrismaService } from '../prisma/prisma.service';
import TestModuleBuilder from '../../test/test.module';
import { UserService } from '../user/user.service';
import { House, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { createRequest } from 'node-mocks-http';
import { JwtService } from '@nestjs/jwt';

describe('HouseController', () => {
  let controller: HouseController;
  let service: HouseService;
  let jwtService: JwtService;

  const testHouse: House = {
    id: randomUUID(),
    discordId: null,
    updatedAt: new Date(),
    createdAt: new Date(),
    name: 'Test House',
    avatar: null,
    public: false,
    banner: null,
  };

  const testUser: User = {
    id: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    username: 'testUser',
    displayName: 'testUser',
    discordId: null,
    banner: null,
    bannerColor: null,
    avatarId: null,
    email: null,
    password: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await (
      await TestModuleBuilder({
        controllers: [HouseController],
        providers: [PrismaService, HouseService, UserService],
      })
    ).compile();

    controller = module.get<HouseController>(HouseController);
    service = module.get<HouseService>(HouseService);
    jwtService = module.get<JwtService>(JwtService);

    service.create = jest.fn().mockResolvedValueOnce(testHouse);
    service.findAll = jest.fn().mockResolvedValueOnce([testHouse]);
    service.findPartial = jest.fn().mockReturnValueOnce([testHouse]);
    service.findOne = jest.fn().mockResolvedValueOnce(testHouse);
    service.update = jest.fn().mockResolvedValueOnce({
      ...testHouse,
      updatedAt: new Date(),
      name: 'Updated House',
    });
    service.findUsers = jest.fn().mockReturnValueOnce([testUser]);
    service.remove = jest.fn().mockResolvedValueOnce({
      ...testHouse,
      name: 'Deleted House',
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to create a house', async () => {
    const house = await controller.create(testHouse);

    expect(house).toBeDefined();
  });

  it('should be able to find all houses', async () => {
    jwtService.verify = jest.fn().mockResolvedValueOnce(testUser);

    const request: Request = createRequest<any>({
      method: 'GET',
      headers: {
        authorization: 'bearer token',
      },
    }) as Request;

    const houses = await controller.findAll(request);

    expect(houses).toBeDefined();
    expect(houses).toBeInstanceOf(Array);
  });

  it('should be able to find a house by part of it', async () => {
    const houses = await controller.findPartial('h');

    expect(houses).toContain(testHouse);
  });

  it('should be able to find a house by id', async () => {
    const house = await controller.findOne(testHouse.id);

    expect(house).toBeDefined();
  });

  it('should be able to update a house by id', async () => {
    const house = await controller.updateById(testHouse.id, testHouse);

    expect(house).toBeDefined();
    expect(house.name).toBe('Updated House');
  });

  it('should be able to find the house users', async () => {
    const users = await controller.findUsers(testHouse.id);

    expect(users).toBeInstanceOf(Array);
    expect(users).toContain(testUser);
  });

  it('should be able to update a house by object', async () => {
    const house = await controller.update(testHouse);

    expect(house).toBeDefined();
    expect(house.name).toBe('Updated House');
  });

  it('should be able to remove a event by id', async () => {
    const house = await controller.removeById(testHouse.id);

    expect(house).toBeDefined();
    expect(house.name).toBe('Deleted House');
  });

  it('should be able to remove a event by object', async () => {
    const house = await controller.remove(testHouse);

    expect(house).toBeDefined();
    expect(house.name).toBe('Deleted House');
  });
});
