import { Test, TestingModule } from '@nestjs/testing';
import { HouseService } from './house.service';
import { PrismaService } from '../prisma.service';
import { ConfigModule } from '@nestjs/config';

describe('HouseService', () => {
  let service: HouseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.local', '.env.dev'],
        }),
      ],
      providers: [PrismaService, HouseService],
    }).compile();

    service = module.get<HouseService>(HouseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
