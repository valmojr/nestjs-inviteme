import { TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import TestModuleBuilder from '../../test/test.module';
import { randomUUID } from 'crypto';
import { sign } from 'jsonwebtoken';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const testUser = {
    id: randomUUID(),
    username: 'test',
    displayName: 'test',
  };

  beforeEach(async () => {
    const module: TestingModule = await TestModuleBuilder({
      providers: [PrismaService, AuthService, UserService],
    });

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);

    process.env.AUTH_SECRET = 'super_secret_key';
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
    const invalidToken = 'invalid-token';
    const validToken = sign(testUser, 'super_secret_key');

    it('should not be able to check the identity if the token provided is invalid', async () => {
      try {
        const auth = await service.getMe(invalidToken);

        expect(auth).toBe(false);
      } catch (error) {
        expect(error.message).toBe('jwt malformed');
      }
    });
    it('should be able to check the identity of a valid token', async () => {
      prisma.user.findUnique = jest.fn().mockReturnValueOnce(testUser);

      const auth = await service.getMe(validToken);

      expect(auth).toMatchObject(testUser);
    });

    it('should return false on ghost identity', async () => {
      prisma.user.findUnique = jest.fn().mockReturnValueOnce(undefined);

      const auth = await service.getMe(validToken);

      expect(auth).toBe(false);
    });
  });
});
