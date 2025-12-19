import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let service: AuthService;
  const userServiceMock = {
    register: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };
  const jwtServiceMock = {
    signAsync: jest.fn().mockResolvedValue('token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('register() should call userService.register and jwt sign', async () => {
    const user = { id: 1, email: 'a@a', role: 'USER' };
    userServiceMock.register.mockResolvedValue(user);

    const res = await service.register({
      name: 'A',
      email: 'a@a',
      password: 'p',
    } as any);
    expect(userServiceMock.register).toHaveBeenCalled();
    expect(jwtServiceMock.signAsync).toHaveBeenCalled();
    expect(res).toHaveProperty('accessToken');
  });
});
