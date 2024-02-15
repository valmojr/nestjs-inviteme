import { TestingModule } from '@nestjs/testing';
import { HouseController } from './house.controller';
import { HouseService } from './house.service';
import { PrismaService } from '../prisma.service';
import TestModuleBuilder from '../../test/test.module';

describe('HouseController', () => {
  let controller: HouseController;

  beforeEach(async () => {
    const module: TestingModule = await TestModuleBuilder({
      controllers: [HouseController],
      providers: [PrismaService, HouseService],
    });

    controller = module.get<HouseController>(HouseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
