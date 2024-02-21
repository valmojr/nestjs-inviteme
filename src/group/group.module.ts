import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [GroupController],
  providers: [PrismaService, GroupService, UserService],
})
export class GroupModule {}
