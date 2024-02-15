import { TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { PrismaService } from '../prisma.service';
import TestModuleBuilder from '../../test/test.module';

describe('GroupController', () => {
  let controller: GroupController;

  beforeEach(async () => {
    const module: TestingModule = await TestModuleBuilder({
      controllers: [GroupController],
      providers: [PrismaService, GroupService],
    });

    controller = module.get<GroupController>(GroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
