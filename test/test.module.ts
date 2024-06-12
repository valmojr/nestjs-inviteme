import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

export default async function TestModuleBuilder({
  controllers,
  providers,
  ...metadata
}: ModuleMetadata) {
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        envFilePath: ['.env.local', '.env.dev'],
      }),
      JwtModule.register({
        global: true,
        secret: process.env.AUTH_SECRET,
        signOptions: { expiresIn: '7 days' },
      }),
    ],
    controllers,
    providers,
    ...metadata,
  });
}
