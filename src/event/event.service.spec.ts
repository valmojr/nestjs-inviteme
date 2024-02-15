import { TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { PrismaService } from '../prisma.service';
import TestModuleBuilder from '../../test/test.module';

describe('EventService', () => {
  let service: EventService;
  let prisma: PrismaService;

  const testEvent = {
    name: 'name',
    startDate: new Date('2025-03-10'),
    endDate: new Date('2025-03-11'),
    thumbnail: 'thumbnail',
    description: 'description',
    location: 'location',
    mainGroupID: null,
    ownerID: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await TestModuleBuilder({
      providers: [PrismaService, EventService],
    });

    service = module.get<EventService>(EventService);

    prisma = module.get<PrismaService>(PrismaService);

    prisma.event.create = jest.fn().mockReturnValueOnce({
      id: 1,
      name: 'Event Done!',
      startDate: new Date(),
      endDate: new Date(),
      description: 'description',
      location: 'location',
      thumbnail: 'thumbnail',
      mainGroupID: null,
      ownerID: null,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not be able to create a event if the name or start date are not provided', async () => {
    try {
      const newEvent = await service.create({
        ...testEvent,
        name: null,
        startDate: null,
      });

      expect(newEvent).toThrowErrorMatchingInlineSnapshot(
        "'Name and start date are required'",
      );
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[Error: Name and start date are required]`,
      );
    }
  });

  it('should not be able to create a event if the start date or end date is not a valid date', async () => {
    try {
      const newEvent = await service.create({
        ...testEvent,
        startDate: new Date('invalid date'),
      });

      expect(newEvent).toThrowErrorMatchingInlineSnapshot(
        "'Start date must be a valid date'",
      );
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[Error: Start date must be a valid date]`,
      );
    }
  });

  it('should not be able to create a event if the start date is in past', async () => {
    try {
      const newEvent = await service.create({
        ...testEvent,
        startDate: new Date('2020-01-01'),
      });

      expect(newEvent).toThrowErrorMatchingInlineSnapshot(
        "'Start date must be in the future'",
      );
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[Error: Start date must be in the future]`,
      );
    }
  });

  it('should not be able to create a event if the start date is later than the end date', async () => {
    try {
      const newEvent = await service.create({
        ...testEvent,
        startDate: new Date('2022-01-01'),
        endDate: new Date('2021-01-01'),
      });

      expect(newEvent).toThrowErrorMatchingInlineSnapshot(
        "'Start date must be before end date'",
      );
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[Error: Start date must be before end date]`,
      );
    }
  });

  it('should be able to create a event', async () => {
    const newEvent = await service.create(testEvent);

    expect(newEvent).toBeDefined();
  });
});
