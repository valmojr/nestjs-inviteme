import { TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { PrismaService } from '../prisma/prisma.service';
import TestModuleBuilder from '../../test/test.module';
import { UserService } from '../user/user.service';
import { Group, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { createRequest } from 'node-mocks-http';

describe('GroupController', () => {
  let controller: GroupController;
  let service: GroupService;
  let jwtService: JwtService;

  const testGroup: Group = {
    id: randomUUID(),
    name: 'Test Group',
    updatedAt: new Date(),
    createdAt: new Date(),
    roleIDs: [],
    fatherGroupID: null,
    eventID: null,
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
    avatar: null,
    email: null,
    password: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await (
      await TestModuleBuilder({
        controllers: [GroupController],
        providers: [PrismaService, GroupService, UserService],
      })
    ).compile();

    controller = module.get<GroupController>(GroupController);
    service = module.get<GroupService>(GroupService);
    jwtService = module.get<JwtService>(JwtService);

    service.create = jest.fn().mockResolvedValueOnce(testGroup);
    service.findAll = jest.fn().mockResolvedValueOnce([testGroup]);
    service.findOne = jest.fn().mockResolvedValueOnce(testGroup);
    service.update = jest.fn().mockResolvedValueOnce({
      ...testGroup,
      updatedAt: new Date(),
      name: 'Updated Group',
    });
    service.remove = jest.fn().mockResolvedValueOnce({
      ...testGroup,
      name: 'Deleted Group',
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to create a group', async () => {
    const group = await controller.create(testGroup);

    expect(group).toEqual(testGroup);
  });

  it('should be able to find all groups', async () => {
    jwtService.verify = jest.fn().mockResolvedValueOnce(testUser);

    const request: Request = createRequest<any>({
      method: 'GET',
      headers: {
        authorization: 'bearer token',
      },
    }) as Request;

    const groups = await controller.findAll(request);

    expect(groups).toBeDefined();
    expect(groups).toBeInstanceOf(Array);
    expect(groups).toEqual([testGroup]);
  });

  it('should be able to find one group', async () => {
    const group = await controller.findOne(testGroup.id);

    expect(group).toEqual(testGroup);
  });

  it('should be able to update a group by id', async () => {
    const group = await controller.updateById(testGroup.id, testGroup);

    expect(group).toBeDefined();
    expect(group.name).toEqual('Updated Group');
  });

  it('should be able to update a group by object', async () => {
    const group = await controller.update(testGroup);

    expect(group).toBeDefined();
    expect(group.name).toEqual('Updated Group');
  });

  it('should be able to remove a group by id', async () => {
    const group = await controller.removeById(testGroup.id);

    expect(group).toBeDefined();
    expect(group.name).toEqual('Deleted Group');
  });

  it('should be able to remove a group by object', async () => {
    const group = await controller.remove(testGroup);

    expect(group).toBeDefined();
    expect(group.name).toEqual('Deleted Group');
  });
});
