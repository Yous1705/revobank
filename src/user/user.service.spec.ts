import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

describe('UserService', () => {
  let service: UserService;
  const repoMock = {
    register: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: UserRepository, useValue: repoMock }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('register() should call repo.register and return', async () => {
    const dto = { name: 'A', email: 'a@a.com', password: 'p' };
    const expected = { id: 1 };
    repoMock.register.mockResolvedValue(expected);

    const res = await service.register(dto as any);
    expect(repoMock.register).toHaveBeenCalledWith(dto);
    expect(res).toBe(expected);
  });

  it('findByEmail() should call repo.findByEmail and return', async () => {
    const expected = { id: 2, email: 'b@b.com' };
    repoMock.findByEmail.mockResolvedValue(expected);

    const res = await service.findByEmail('b@b.com');
    expect(repoMock.findByEmail).toHaveBeenCalledWith('b@b.com');
    expect(res).toBe(expected);
  });
});
