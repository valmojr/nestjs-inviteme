import { Module } from '@nestjs/common';
import { HouseService } from './house.service';
import { HouseController } from './house.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [HouseController],
  providers: [PrismaService, HouseService],
  exports: [HouseService],
})
export class HouseModule {}
