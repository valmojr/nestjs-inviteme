import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [GroupController],
  providers: [PrismaService, GroupService],
  exports: [GroupService],
})
export class GroupModule {}
