import { TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { PrismaService } from '../prisma/prisma.service';
import TestModuleBuilder from '../../test/test.module';
import { UserService } from '../user/user.service';
import { Role } from '@prisma/client';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';

describe('RoleController', () => {
  let controller: RoleController;
  let service: RoleService;
  let jwtService: JwtService;

  const testRole: Role = {
    id: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'test',
    userId: null,
    groupID: null,
  };
  beforeEach(async () => {
    const module: TestingModule = await (
      await TestModuleBuilder({
        controllers: [RoleController],
        providers: [PrismaService, RoleService, UserService],
      })
    ).compile();

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleService>(RoleService);
    jwtService = module.get<JwtService>(JwtService);

    service.create = jest.fn().mockResolvedValueOnce(testRole);
    service.findAll = jest.fn().mockResolvedValueOnce([testRole]);
    service.findOne = jest.fn().mockResolvedValueOnce(testRole);
    service.update = jest.fn().mockResolvedValueOnce({
      ...testRole,
      updatedAt: new Date(),
      name: 'updated role',
    });
    service.remove = jest.fn().mockResolvedValueOnce({
      ...testRole,
      name: 'deleted role',
    });

    jwtService.verify = jest.fn().mockReturnValueOnce({
      id: 'test-user-id',
      username: 'user',
      displayName: 'User',
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to create e Role', async () => {
    const role = await controller.create(testRole);

    expect(role).toBeDefined();
  });

  it('should be able to find one Role', async () => {
    const role = await controller.findOne(testRole.id);

    expect(role).toBeDefined();
    expect(role.id).toEqual(testRole.id);
  });

  it('should be able to update a role by id', async () => {
    const role = await controller.update(testRole.id, testRole);

    expect(role).toBeDefined();
    expect(role.name).toEqual('updated role');
  });

  it('should be able to update a role by object', async () => {
    const role = await controller.updateOne(testRole);

    expect(role).toBeDefined();
    expect(role.name).toEqual('updated role');
  });

  it('should be able to remove a role by id', async () => {
    const role = await controller.remove(testRole.id);

    expect(role).toBeDefined();
    expect(role.name).toEqual('deleted role');
  });

  it('should be able to remove a role by object', async () => {
    const role = await controller.removeOne(testRole);

    expect(role).toBeDefined();
    expect(role.name).toEqual('deleted role');
  });
});
