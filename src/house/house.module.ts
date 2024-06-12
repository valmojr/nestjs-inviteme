import { Module } from '@nestjs/common';
import { HouseService } from './house.service';
import { HouseController } from './house.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [HouseController],
  providers: [PrismaService, HouseService, UserService],
})
export class HouseModule {}
