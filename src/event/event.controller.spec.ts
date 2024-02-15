import { TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { PrismaService } from '../prisma.service';
import TestModuleBuilder from '../../test/test.module';

describe('EventController', () => {
  let controller: EventController;

  beforeEach(async () => {
    const module: TestingModule = await TestModuleBuilder({
      controllers: [EventController],
      providers: [PrismaService, EventService],
    });

    controller = module.get<EventController>(EventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
