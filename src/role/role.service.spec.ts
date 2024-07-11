import { TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { PrismaService } from '../prisma/prisma.service';
import TestModuleBuilder from '../../test/test.module';
import { Role } from '@prisma/client';
import { randomUUID } from 'crypto';

describe('RoleService', () => {
  let service: RoleService;
  let prisma: PrismaService;

  const testRole: Role = {
    id: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Test Role',
    eventID: null,
    userId: null,
    groupID: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await (
      await TestModuleBuilder({
        providers: [PrismaService, RoleService],
      })
    ).compile();

    service = module.get<RoleService>(RoleService);
    prisma = module.get<PrismaService>(PrismaService);

    prisma.role.create = jest.fn().mockResolvedValue(testRole);
    prisma.role.findUnique = jest.fn().mockResolvedValue(testRole);
    prisma.role.findMany = jest.fn().mockResolvedValue([testRole]);
    prisma.role.update = jest.fn().mockResolvedValue({
      ...testRole,
      name: 'Updated Role',
      updatedAt: new Date(),
    });
    prisma.role.delete = jest.fn().mockResolvedValue({
      ...testRole,
      name: 'Removed Role',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a role', async () => {
    const role = await service.create(testRole);

    expect(role).toHaveProperty('id');
  });

  it('should not be able to create a role if nothing is provided', async () => {
    try {
      const role = await service.create(null);

      expect(role).not.toBeDefined();
    } catch (error) {
      expect(error.message).toContain('Role ID is required');
    }
  });

  it('should find all roles', async () => {
    const roles = await service.findAll('123');

    expect(roles).toBeInstanceOf(Array);
  });

  it('should find a role by id', async () => {
    const role = await service.findOne(testRole.id);

    expect(role).toHaveProperty('id');
  });

  it('should find a role by object', async () => {
    const role = await service.findOne(testRole);

    expect(role).toHaveProperty('id');
  });

  it('should update a role', async () => {
    const role = await service.update(testRole);

    expect(role).toHaveProperty('id');
    expect(role.name).toBe('Updated Role');
    expect(role.updatedAt).not.toEqual(testRole.updatedAt);
  });

  it('should not be able to update a role if nothing is provided', async () => {
    try {
      const role = await service.update(null);

      expect(role).not.toBeDefined();
    } catch (error) {
      expect(error.message).toContain('Role is required');
    }
  });

  it('should delete a role by id', async () => {
    const role = await service.remove(testRole.id);

    expect(role).toHaveProperty('id');
  });

  it('should delete a role by object', async () => {
    const role = await service.remove(testRole);

    expect(role).toHaveProperty('id');
  });

  it('should not be able to remove a role if nothing is provided', async () => {
    try {
      const role = await service.remove(null);

      expect(role).not.toBeDefined();
    } catch (error) {
      expect(error.message).toContain('Role is required');
    }
  });
});
