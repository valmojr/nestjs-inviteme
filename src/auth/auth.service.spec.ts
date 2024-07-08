import { TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import TestModuleBuilder from '../../test/test.module';
import { randomUUID } from 'crypto';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Response } from 'express';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let userService: UserService;

  let validToken: string;
  let invalidToken: string;

  const testUser: User = {
    id: randomUUID(),
    username: 'test',
    displayName: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
    avatarId: null,
    email: null,
    password: null,
    bannerColor: null,
    discordId: null,
    banner: null,
  };

  beforeEach(async () => {
    process.env.AUTH_SECRET = 'super_secret_key';

    const module: TestingModule = await (
      await TestModuleBuilder({
        imports: [
          JwtModule.register({
            global: true,
            secret: process.env.AUTH_SECRET,
            signOptions: { expiresIn: '1 hour' },
          }),
        ],
        providers: [PrismaService, AuthService, UserService, JwtService],
      })
    ).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);

    validToken = jwtService.sign({ user: testUser });
    invalidToken = 'invalid_token';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Sign In function Tests', () => {
    it('should throw unauthorized exception if wrong auth params are provided', async () => {
      prisma.user.findUnique = jest.fn().mockReturnValueOnce(null);

      try {
        await service.signIn(testUser);
      } catch (error) {
        expect(error.message).toBe('user not found');
      }
    });

    it('should return a valid authorization if the right auth params are provided', async () => {
      prisma.user.findUnique = jest.fn().mockReturnValueOnce(testUser);

      const result = await service.signIn(testUser);

      expect(result).toMatchObject(testUser);
    });
  });

  describe('Identity Checker Tests', () => {
    it('should not be able to check the identity if the token provided is invalid', async () => {
      try {
        const auth = await service.getMe(invalidToken);

        expect(auth).toBe(false);
      } catch (error) {
        expect(error.message).toBe('jwt malformed');
      }
    });
    it('should be able to check the identity of a valid token', async () => {
      userService.findOne = jest.fn().mockReturnValueOnce(testUser);

      const auth = await service.getMe(validToken);

      expect(auth).toMatchObject(testUser);
    });

    it('should return false on ghost identity', async () => {
      userService.findOne = jest.fn().mockReturnValue(undefined);

      const auth = await service.getMe(validToken);

      expect(auth).toBe(false);
    });
  });

  describe('Discord OAuth2 Method Tests', () => {
    const validCode: string = 'validCode';
    const invalidCode: string = 'invalidCode';
    let response: Response;

    beforeEach(() => {});
    it('should throw error if no code is provided', async () => {
      const testedResponse = service.discordOAuthCallback(null, response);

      expect(testedResponse).toBeDefined();
    });

    it('should throw error if the code provided is invalid', async () => {
      const testedResponse = service.discordOAuthCallback(
        invalidCode,
        response,
      );

      expect(testedResponse).toBeDefined();
    });

    it('should return a valid response if the provided code is valid', async () => {
      const testedResponse = service.discordOAuthCallback(validCode, response);

      expect(testedResponse).toBeDefined();
    });
  });
});
