import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { ConfigModule } from '@nestjs/config';
import { GroupModule } from './group/group.module';
import { HouseModule } from './house/house.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { DiscordModule } from './discord/discord.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.dev'],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.AUTH_SECRET,
      signOptions: { expiresIn: '7 days' },
    }),
    EventModule,
    GroupModule,
    HouseModule,
    UserModule,
    RoleModule,
    AuthModule,
    DiscordModule,
    ImageModule,
  ],
})
export class AppModule {}
