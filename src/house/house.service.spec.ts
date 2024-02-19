import { TestingModule } from '@nestjs/testing';
import { HouseService } from './house.service';
import { PrismaService } from '../prisma/prisma.service';
import TestModuleBuilder from '../../test/test.module';

describe('HouseService', () => {
  let service: HouseService;

  beforeEach(async () => {
    const module: TestingModule = await TestModuleBuilder({
      providers: [PrismaService, HouseService],
    });

    service = module.get<HouseService>(HouseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
