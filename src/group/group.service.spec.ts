import { TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { PrismaService } from '../prisma/prisma.service';
import TestModuleBuilder from '../../test/test.module';
import { randomUUID } from 'crypto';
import { Group } from '@prisma/client';

describe('GroupService', () => {
  let service: GroupService;
  let prisma: PrismaService;

  const testGroup: Group = {
    id: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Test Event',
    roleIDs: [],
    fatherGroupID: null,
    eventID: randomUUID(),
  };

  beforeEach(async () => {
    const module: TestingModule = await (
      await TestModuleBuilder({
        providers: [PrismaService, GroupService],
      })
    ).compile();

    service = module.get<GroupService>(GroupService);
    prisma = module.get<PrismaService>(PrismaService);

    prisma.group.create = jest.fn().mockResolvedValue(testGroup);
    prisma.group.findUnique = jest.fn().mockResolvedValue(testGroup);
    prisma.group.findMany = jest.fn().mockResolvedValue([testGroup]);
    prisma.group.update = jest.fn().mockResolvedValue({
      ...testGroup,
      name: 'Updated Group',
      updatedAt: new Date(),
    });
    prisma.group.delete = jest.fn().mockResolvedValue({
      ...testGroup,
      name: 'Removed Group',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a group', async () => {
    const group = await service.create(testGroup);

    expect(group).toHaveProperty('id');
  });

  it('should find all groups', async () => {
    const groups = await service.findAll();

    expect(groups).toBeInstanceOf(Array);
  });

  it('should find group by id', async () => {
    const foundGroup = await service.findOne(testGroup.id);

    expect(foundGroup).toBeDefined();
    expect(foundGroup).toHaveProperty('id');
  });

  it('should find group by object', async () => {
    const foundGroup = await service.findOne(testGroup);

    expect(foundGroup).toBeDefined();
    expect(foundGroup).toHaveProperty('id');
  });

  it('should update a group', async () => {
    const group = await service.create(testGroup);

    const updatedGroup = await service.update(testGroup);

    expect(updatedGroup.name).toBe('Updated Group');
    expect(group.name).not.toEqual(updatedGroup.name);
    expect(updatedGroup.updatedAt).not.toEqual(group.updatedAt);
  });

  it('should remove a group by id', async () => {
    const removedGroup = await service.remove(testGroup.id);

    expect(removedGroup).toHaveProperty('id');
    expect(removedGroup.name).toBe('Removed Group');
  });

  it('should remove a group by object', async () => {
    const removedGroup = await service.remove(testGroup);

    expect(removedGroup).toHaveProperty('id');
    expect(removedGroup.name).toBe('Removed Group');
  });
});
