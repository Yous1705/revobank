import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authMock = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('register() should call authService.register and return value', async () => {
    const dto = { name: 'T', email: 't@t.com', password: 'p' };
    const expected = { id: 1 };
    (authMock.register as jest.Mock).mockResolvedValue(expected);

    const res = await controller.register(dto as any);
    expect(authMock.register).toHaveBeenCalledWith(dto);
    expect(res).toBe(expected);
  });

  it('login() should call authService.login with email and password and return value', async () => {
    const dto = { email: 'a@a.com', password: 'p' };
    const expected = { accessToken: 'token' };
    (authMock.login as jest.Mock).mockResolvedValue(expected);

    const res = await controller.login(dto);
    expect(authMock.login).toHaveBeenCalledWith(dto.email, dto.password);
    expect(res).toBe(expected);
  });

  it('logout() should call authService.logout with user id and return value', async () => {
    const req = { user: { sub: 10 } };
    const expected = { ok: true };
    (authMock.logout as jest.Mock).mockResolvedValue(expected);

    const res = await controller.logout(req as any);
    expect(authMock.logout).toHaveBeenCalledWith(10);
    expect(res).toBe(expected);
  });
});
