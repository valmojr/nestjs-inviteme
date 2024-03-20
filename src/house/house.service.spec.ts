import { TestingModule } from '@nestjs/testing';
import { HouseService } from './house.service';
import { PrismaService } from '../prisma/prisma.service';
import TestModuleBuilder from '../../test/test.module';
import { House } from '@prisma/client';
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

  it('should find a house by id', async () => {
    const house = await service.findOne(testHouse.id);

    expect(house).toHaveProperty('id');
  });

  it('should find a house by object', async () => {
    const house = await service.findOne(testHouse);

    expect(house).toHaveProperty('id');
  });

  it('should update a house', async () => {
    const house = await service.update(testHouse);

    expect(house).toHaveProperty('id');
    expect(house.name).toBe('Updated House');
    expect(house.updatedAt).not.toEqual(testHouse.updatedAt);
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
});
