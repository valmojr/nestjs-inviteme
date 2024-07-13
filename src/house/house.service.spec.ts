import { TestingModule } from '@nestjs/testing';
import { HouseService } from './house.service';
import { PrismaService } from '../prisma/prisma.service';
import TestModuleBuilder from '../../test/test.module';
import { House, User } from '@prisma/client';
import { randomUUID } from 'crypto';

describe('HouseService', () => {
  let service: HouseService;
  let prisma: PrismaService;

  const testHouse: House = {
    id: randomUUID(),
    discordId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
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
    displayName: 'Test User',
    discordId: null,
    avatarId: null,
    email: null,
    password: null,
    bannerColor: null,
    banner: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await (
      await TestModuleBuilder({
        providers: [PrismaService, HouseService],
      })
    ).compile();

    service = module.get<HouseService>(HouseService);
    prisma = module.get<PrismaService>(PrismaService);

    prisma.house.create = jest.fn().mockResolvedValue(testHouse);
    prisma.house.findUnique = jest.fn().mockResolvedValue(testHouse);
    prisma.house.findMany = jest.fn().mockResolvedValue([testHouse]);
    prisma.house.upsert = jest.fn().mockResolvedValue(testHouse);
    prisma.house.update = jest.fn().mockResolvedValue({
      ...testHouse,
      name: 'Updated House',
      updatedAt: new Date(),
    });
    prisma.house.delete = jest.fn().mockResolvedValue({
      ...testHouse,
      name: 'Removed House',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a house', async () => {
    const house = await service.create(testHouse);

    expect(house).toHaveProperty('id');
  });

  it('should find all houses', async () => {
    const houses = await service.findAll('123');

    expect(houses).toBeInstanceOf(Array);
  });

  it('should be able to find a house by part of its name', async () => {
    const houses = await service.findPartial('a');

    expect(houses).toEqual([testHouse]);
  });

  it('should be able to find a house by a discord id', async () => {
    const house = await service.findByDiscordId('discordId');

    expect(house).toEqual(testHouse);
  });

  it('should be able to return the users insert on a house', async () => {
    prisma.house.findUnique = jest.fn().mockReturnValue([testUser]);

    const users = await service.findUsers('discordId');

    expect(users).toContain(testUser);

    const usersById = await service.findUsers(testHouse);

    expect(usersById).toContain(testUser);
  });

  it('should find a house by id', async () => {
    const house = await service.findOne(testHouse.id);

    expect(house).toHaveProperty('id');
  });

  it('should find a house by object', async () => {
    const house = await service.findOne(testHouse);

    expect(house).toHaveProperty('id');
  });

  it('should be able to upsert a house', async () => {
    const house = await service.upsert(testHouse);

    expect(house).toEqual(testHouse);

    const updatedHouse: House = { ...testHouse, name: 'updatedHouse' };

    prisma.house.upsert = jest.fn().mockResolvedValue(updatedHouse);

    const newHouse = await service.upsert(updatedHouse);

    expect(house).toEqual(testHouse);
    expect(newHouse).toEqual(updatedHouse);
    expect(house.id).toEqual(newHouse.id);
  });

  it('should be able to upsert a house by discord id', async () => {
    const house = await service.upsertByDiscord({
      ...testHouse,
      discordId: '12345',
    });

    expect(house).toEqual(testHouse);

    const updatedHouse: House = { ...testHouse, name: 'updatedHouse' };

    prisma.house.upsert = jest.fn().mockResolvedValue(updatedHouse);

    const newHouse = await service.upsertByDiscord({
      ...updatedHouse,
      discordId: '12345',
    });

    expect(house).toEqual(testHouse);
    expect(newHouse).toEqual(updatedHouse);
    expect(house.id).toEqual(newHouse.id);
  });

  it('should not be able to upsert a house by discord id if not provided', async () => {
    try {
      const house = await service.upsertByDiscord(testHouse);

      expect(house).toEqual(testHouse);

      const updatedHouse: House = { ...testHouse, name: 'updatedHouse' };

      prisma.house.upsert = jest.fn().mockResolvedValue(updatedHouse);

      const newHouse = await service.upsertByDiscord(updatedHouse);

      expect(house).not.toBeDefined();
      expect(newHouse).not.toBeDefined();
    } catch (error) {
      expect(error.message).toContain(
        'Discord Id is required to upsert by discord id',
      );
    }
  });

  it('should update a house', async () => {
    const house = await service.update(testHouse);

    expect(house).toHaveProperty('id');
    expect(house.name).toBe('Updated House');
    expect(house.updatedAt).not.toEqual(testHouse.updatedAt);
  });

  it('should not be able to remove a houve if nothing is provided', async () => {
    try {
      const house = await service.remove(null);

      expect(house).not.toBeDefined();
    } catch (error) {
      expect(error.message).toContain('House info is required');
    }
  });

  it('should remove a house by id', async () => {
    const house = await service.remove(testHouse.id);

    expect(house).toHaveProperty('id');
    expect(house.name).toBe('Removed House');
  });

  it('should remove a house by object', async () => {
    const house = await service.remove(testHouse);

    expect(house).toHaveProperty('id');
    expect(house.name).toBe('Removed House');
  });

  it('should be able to remove a house by discord id', async () => {
    const house = await service.removeByDiscordId('discordId');

    expect(house).toHaveProperty('id');
    expect(house.name).toBe('Removed House');
  });

  it('should be able to remove a house by discord id with object', async () => {
    const house = await service.removeByDiscordId(testHouse);

    expect(house).toHaveProperty('id');
    expect(house.name).toBe('Removed House');
  });

  it('should be able to add users to houses with both objects', async () => {
    const house = await service.addUser(testUser, testHouse);

    expect(house).toBeDefined();
  });

  it('should be able to add user to houses with house id and user', async () => {
    const house = await service.addUser(testUser, testHouse.id);

    expect(house).toBeDefined();
  });

  it('should be able to add user to house with house and user id', async () => {
    const house = await service.addUser(testUser.id, testHouse);

    expect(house).toBeDefined();
  });

  it('should be able to add user to house with both ids', async () => {
    const house = await service.addUser(testUser.id, testHouse.id);

    expect(house).toBeDefined();
  });

  it('should be able to remove users to houses with both objects', async () => {
    const house = await service.removeUser(testUser, testHouse);

    expect(house).toBeDefined();
  });

  it('should be able to remove user to houses with house id and user', async () => {
    const house = await service.removeUser(testUser, testHouse.id);

    expect(house).toBeDefined();
  });

  it('should be able to remove user to house with house and user id', async () => {
    const house = await service.removeUser(testUser.id, testHouse);

    expect(house).toBeDefined();
  });

  it('should be able to remove user to house with both ids', async () => {
    const house = await service.removeUser(testUser.id, testHouse.id);

    expect(house).toBeDefined();
  });
});
