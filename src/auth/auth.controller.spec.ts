import { TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import TestModuleBuilder from '../../test/test.module';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser: User = {
    id: '1',
    username: 'test user',
    displayName: 'Test User',
    discordId: '1234567890',
    createdAt: new Date(),
    updatedAt: new Date(),
    password: null,
    avatarId: null,
    email: null,
    bannerColor: null,
    banner: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await (
      await TestModuleBuilder({
        controllers: [AuthController],
        providers: [AuthService, UserService, JwtService, PrismaService],
      })
    ).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signIn auth function', () => {
    it('should return the user if signIn is successful', async () => {
      jest.spyOn(authService, 'signIn').mockResolvedValueOnce(mockUser);

      const result = await controller.signIn(mockUser);

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const mockUser = {
        id: '2',
        username: 'nonexistent',
        displayName: 'Nonexistent User',
      };
      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValueOnce(new UnauthorizedException('user not found'));

      const signIn = () => controller.signIn(mockUser);

      try {
        expect(signIn).rejects.toThrow(UnauthorizedException);
      } catch (error) {
        expect(error.message).toEqual('user not found');
      }
    });
  });

  describe('me auth function', () => {
    it('should return user details if token is valid', async () => {
      const mockToken = 'validToken';

      jest.spyOn(authService, 'getMe').mockResolvedValueOnce(mockUser);

      const result = await controller.me({
        headers: { authorization: `Bearer ${mockToken}` },
      } as any);

      expect(result).toEqual(mockUser);
    });

    it('should return false if token is invalid', async () => {
      const mockToken = 'invalidToken';
      jest.spyOn(authService, 'getMe').mockResolvedValueOnce(false);

      const result = await controller.me({
        headers: { authorization: `Bearer ${mockToken}` },
      } as any);

      expect(result).toEqual(false);
    });
  });
  describe('Discord OAuth2 Route tests', () => {
    it('should not return a user if the discord provided info is not valid', async () => {});
    it('should return a user if the discord provided info is valid', async () => {});
    it("should return a updated user if the user's info already exists on the user table", async () => {});
  });
});
