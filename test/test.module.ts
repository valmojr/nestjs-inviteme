import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

const TestModule = async ({
  imports,
  controllers,
  providers,
  ...data
}: ModuleMetadata) =>
  await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        envFilePath: ['.env.local', '.env.dev', '.env.prod'],
      }),
      ...imports,
    ],
    controllers: [...controllers],
    providers: [...providers],
    ...data,
  }).compile();

export default TestModule;
