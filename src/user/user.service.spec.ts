import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to create a Event', async () => {
    const newUser = await service.create({
      username: 'username',
      displayName: null,
      password: null,
      email: null,
      avatar: null,
      bannerColor: null,
    });

    expect(newUser).toBeDefined();
  });
});
