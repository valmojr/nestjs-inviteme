import { TestingModule } from '@nestjs/testing';
import { HouseController } from './house.controller';
import { HouseService } from './house.service';
import { PrismaService } from '../prisma/prisma.service';
import TestModuleBuilder from '../../test/test.module';
import { UserService } from '../user/user.service';
import { House } from '@prisma/client';
import { randomUUID } from 'crypto';

describe('HouseController', () => {
  let controller: HouseController;
  let service: HouseService;

  const testHouse: House = {
    id: randomUUID(),
    updatedAt: new Date(),
    createdAt: new Date(),
    name: 'Test House',
    avatar: null,
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

    service.create = jest.fn().mockResolvedValueOnce(testHouse);
    service.findAll = jest.fn().mockResolvedValueOnce([testHouse]);
    service.findOne = jest.fn().mockResolvedValueOnce(testHouse);
    service.update = jest.fn().mockResolvedValueOnce({
      ...testHouse,
      updatedAt: new Date(),
      name: 'Updated House',
    });
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
    const houses = await controller.findAll();

    expect(houses).toBeDefined();
    expect(houses).toBeInstanceOf(Array);
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
    const house = await controller.remove(testHouse.id);

    expect(house).toBeDefined();
    expect(house.name).toBe('Deleted House');
  });
});
