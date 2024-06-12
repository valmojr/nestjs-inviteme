import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [RoleController],
  providers: [PrismaService, RoleService, UserService],
})
export class RoleModule {}
