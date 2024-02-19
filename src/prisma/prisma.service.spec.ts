import { TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import TestModuleBuilder from '../../test/test.module';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await (
      await TestModuleBuilder({
        providers: [PrismaService],
      })
    ).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should connect to Prisma on module initialization', async () => {
    const connectSpy = jest.spyOn(service, '$connect');

    await service.onModuleInit();

    expect(connectSpy).toHaveBeenCalledTimes(1);
  });
});
