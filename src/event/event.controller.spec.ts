import { TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { PrismaService } from '../prisma/prisma.service';
import TestModuleBuilder from '../../test/test.module';
import { UserService } from '../user/user.service';
import { Event, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { createRequest } from 'node-mocks-http';
import { Request } from 'express';

describe('EventController', () => {
  let controller: EventController;
  let service: EventService;
  let jwtService: JwtService;

  const testEvent: Event = {
    id: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Test Event',
    startDate: new Date(),
    endDate: null,
    thumbnailId: null,
    mainGroupID: null,
    ownerID: null,
    location: null,
    description: null,
    visibility: 'PUBLIC',
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
        controllers: [EventController],
        providers: [PrismaService, EventService, UserService],
      })
    ).compile();

    controller = module.get<EventController>(EventController);
    service = module.get<EventService>(EventService);
    jwtService = module.get<JwtService>(JwtService);

    service.create = jest.fn().mockResolvedValueOnce(testEvent);
    service.findAll = jest.fn().mockResolvedValueOnce([testEvent]);
    service.findOne = jest.fn().mockResolvedValueOnce(testEvent);
    service.update = jest.fn().mockResolvedValueOnce({
      ...testEvent,
      updatedAt: new Date(),
      name: 'Updated Event',
    });
    service.remove = jest.fn().mockResolvedValueOnce({
      ...testEvent,
      name: 'Deleted Event',
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to create an event', async () => {
    const event = await controller.create(testEvent);

    expect(event).toEqual(testEvent);
  });

  it('should be able to find all events', async () => {
    jwtService.verify = jest.fn().mockResolvedValueOnce(testUser);

    const request: Request = createRequest<any>({
      method: 'GET',
      headers: {
        authorization: 'bearer token',
      },
    }) as Request;

    const events = await controller.findAll(request);

    expect(events).toEqual([testEvent]);
  });

  it('should be able to find one event', async () => {
    const event = await controller.findOne(testEvent.id);

    expect(event).toEqual(testEvent);
  });

  it('should be able to update an event by id', async () => {
    const event = await controller.updateById(testEvent.id, testEvent);

    expect(event).toEqual({
      ...testEvent,
      updatedAt: expect.any(Date),
      name: 'Updated Event',
    });
  });

  it('should be able to update an event by object', async () => {
    const event = await controller.update(testEvent);

    expect(event).toEqual({
      ...testEvent,
      updatedAt: expect.any(Date),
      name: 'Updated Event',
    });
  });

  it('should be able to remove an event by id', async () => {
    const event = await controller.removeById(testEvent.id);

    expect(event).toEqual({
      ...testEvent,
      name: 'Deleted Event',
    });
  });

  it('should be able to remove an event by object', async () => {
    const event = await controller.remove(testEvent);

    expect(event).toEqual({
      ...testEvent,
      name: 'Deleted Event',
    });
  });
});
