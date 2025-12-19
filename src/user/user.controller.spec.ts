import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  const serviceMock = {
    register: jest.fn(),
    findAll: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: serviceMock }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('register() should call userService.register', async () => {
    const dto = { name: 't', email: 't@t', password: 'p' };
    const expected = { id: 1 };
    serviceMock.register.mockResolvedValue(expected);

    const res = await controller.register(dto as any);
    expect(serviceMock.register).toHaveBeenCalledWith(dto);
    expect(res).toBe(expected);
  });

  it('findAll() should call userService.findAll', async () => {
    const expected = [{ id: 1 }];
    serviceMock.findAll.mockResolvedValue(expected);

    const res = await controller.findAll();
    expect(serviceMock.findAll).toHaveBeenCalled();
    expect(res).toBe(expected);
  });
});
