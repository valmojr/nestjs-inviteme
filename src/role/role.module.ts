import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [RoleController],
  providers: [PrismaService, RoleService],
  exports: [RoleService],
})
export class RoleModule {}
