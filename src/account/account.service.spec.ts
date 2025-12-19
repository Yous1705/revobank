import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';

describe('AccountService', () => {
  let service: AccountService;
  let repo: Partial<Record<'createAccount' | 'findByUser', jest.Mock>>;

  beforeEach(async () => {
    repo = {
      createAccount: jest.fn(),
      findByUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: AccountRepository, useValue: repo },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createAccount() should call repo.createAccount and return its result', async () => {
    const userId = 7;
    const created = { id: 1, accountNumber: '999', balance: 0 };
    (repo.createAccount as jest.Mock).mockResolvedValue(created);

    const res = await service.createAccount(userId);
    expect(repo.createAccount).toHaveBeenCalledWith(userId);
    expect(res).toBe(created);
  });

  it('createAccount() should propagate errors from repo.createAccount', async () => {
    const userId = 100;
    const err = new Error('User not found');
    (repo.createAccount as jest.Mock).mockRejectedValue(err);

    await expect(service.createAccount(userId)).rejects.toThrow(
      'User not found',
    );
  });

  it('getUserAccount() should call repo.findByUser and return its result', async () => {
    const userId = 33;
    const accounts = [{ id: 3, accountNumber: '321', balance: 50 }];
    (repo.findByUser as jest.Mock).mockResolvedValue(accounts);

    const res = await service.getUserAccount(userId);
    expect(repo.findByUser).toHaveBeenCalledWith(userId);
    expect(res).toBe(accounts);
  });
});
