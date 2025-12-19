import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

describe('AccountController', () => {
  let controller: AccountController;
  let service: Partial<Record<'createAccount' | 'getUserAccount', jest.Mock>>;

  beforeEach(async () => {
    service = {
      createAccount: jest.fn(),
      getUserAccount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [{ provide: AccountService, useValue: service }],
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create() should call accountService.createAccount with user id and return value', async () => {
    const mockReq = { user: { sub: 42 } };
    const createdAccount = { id: 1, accountNumber: '123', balance: 0 };
    (service.createAccount as jest.Mock).mockResolvedValue(createdAccount);

    const res = await controller.create(mockReq);
    expect(service.createAccount).toHaveBeenCalledWith(42);
    expect(res).toBe(createdAccount);
  });

  it('getUserAccount() should call accountService.getUserAccount with user id and return value', async () => {
    const mockReq = { user: { sub: 99 } };
    const accounts = [{ id: 2, accountNumber: '456', balance: 100 }];
    (service.getUserAccount as jest.Mock).mockResolvedValue(accounts);

    const res = await controller.getUserAccount(mockReq);
    expect(service.getUserAccount).toHaveBeenCalledWith(99);
    expect(res).toBe(accounts);
  });
});
