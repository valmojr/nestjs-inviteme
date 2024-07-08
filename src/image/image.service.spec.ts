import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageService, PrismaService],
    }).compile();

    service = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
