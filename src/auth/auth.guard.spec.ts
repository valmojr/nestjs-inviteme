import { TestingModule } from '@nestjs/testing';
import TestModuleBuilder from '../../test/test.module';
import { AuthGuard } from './auth.guard';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { ExecutionContext } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('Auth Guard Tests', () => {
  let userService: UserService;
  let guard: AuthGuard;
  let jwtService: JwtService;

  const mockUser: User = {
    id: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    username: 'username',
    displayName: 'displayName',
    discordId: null,
    password: null,
    email: null,
    avatar: null,
    bannerColor: null,
  };

  const executionContext: ExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn(),
      getResponse: jest.fn(),
    }),
    getClass: jest.fn(),
    getHandler: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await (
      await TestModuleBuilder({
        imports: [
          JwtModule.register({
            global: true,
            secret: process.env.AUTH_SECRET,
            signOptions: { expiresIn: '1d' },
          }),
        ],
        providers: [PrismaService, AuthService, AuthGuard, UserService],
      })
    ).compile();

    userService = module.get<UserService>(UserService);
    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should return false if the bearer token is not provided', async () => {
    executionContext.switchToHttp().getRequest = jest.fn().mockReturnValue({
      headers: {
        authorization: null,
      },
    });

    try {
      const authorization = guard.canActivate(executionContext);

      expect(authorization).rejects.toThrowErrorMatchingInlineSnapshot(
        `"no token provided"`,
      );
    } catch (error) {
      expect(error.message).toBe('no token provided');
    }
  });

  it('should return false if the bearer token is invalid', async () => {
    executionContext.switchToHttp().getRequest = jest.fn().mockReturnValue({
      headers: {
        authorization: 'Bearer invalid_token',
      },
    });

    try {
      const authorization = guard.canActivate(executionContext);

      expect(authorization).rejects.toThrowErrorMatchingInlineSnapshot(
        `"jwt malformed"`,
      );
    } catch (error) {
      expect(error.message).toBe('jwt malformed');
    }
  });

  it('should return false if the bearer token does not mean a valid user', async () => {
    jwtService.verifyAsync = jest.fn().mockResolvedValueOnce(mockUser);
    userService.findOne = jest.fn().mockResolvedValueOnce(undefined);

    executionContext.switchToHttp().getRequest = jest.fn().mockReturnValueOnce({
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer valid_token',
      },
    });

    try {
      const authorization = await guard.canActivate(executionContext);

      expect(authorization).rejects.toThrowErrorMatchingInlineSnapshot(
        `"user not found"`,
      );
    } catch (error) {
      expect(error.message).toContain('user not found');
    }
  });

  it('should return true if the bearer token means a valid user', async () => {
    jwtService.verifyAsync = jest.fn().mockResolvedValueOnce(mockUser);
    userService.findOne = jest.fn().mockResolvedValueOnce(mockUser);

    executionContext.switchToHttp().getRequest = jest.fn().mockReturnValue({
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer valid_token',
      },
    });

    const authorization = await guard.canActivate(executionContext);
    expect(authorization).toBeTruthy();
  });
});
