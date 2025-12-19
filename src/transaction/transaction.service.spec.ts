import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';

describe('TransactionService', () => {
  let service: TransactionService;
  let repo: Partial<
    Record<
      'deposit' | 'withdraw' | 'transfer' | 'findHistoryByAccount',
      jest.Mock
    >
  >;

  beforeEach(async () => {
    repo = {
      deposit: jest.fn(),
      withdraw: jest.fn(),
      transfer: jest.fn(),
      findHistoryByAccount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: TransactionRepository, useValue: repo },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deposit() should call repo.deposit and return result', async () => {
    const userId = 1;
    const accountNumber = '111';
    const amount = 100;
    const expected = { id: 1 };
    (repo.deposit as jest.Mock).mockResolvedValue(expected);

    const res = await service.deposit(userId, accountNumber, amount);
    expect(repo.deposit).toHaveBeenCalledWith(userId, accountNumber, amount);
    expect(res).toBe(expected);
  });

  it('withdraw() should call repo.withdraw and return result', async () => {
    const expected = { id: 2 };
    (repo.withdraw as jest.Mock).mockResolvedValue(expected);
    const res = await service.withdraw(1, '111', 50);
    expect(repo.withdraw).toHaveBeenCalledWith(1, '111', 50);
    expect(res).toBe(expected);
  });

  it('transfer() should call repo.transfer and return result', async () => {
    const expected = { id: 3 };
    (repo.transfer as jest.Mock).mockResolvedValue(expected);
    const res = await service.transfer(1, '111', '222', 25);
    expect(repo.transfer).toHaveBeenCalledWith(1, '111', '222', 25);
    expect(res).toBe(expected);
  });

  it('getHistoryByAccount() should call repo.findHistoryByAccount and return result', async () => {
    const expected = [{ id: 4 }];
    (repo.findHistoryByAccount as jest.Mock).mockResolvedValue(expected);
    const res = await service.getHistoryByAccount(1);
    expect(repo.findHistoryByAccount).toHaveBeenCalledWith(1);
    expect(res).toBe(expected);
  });
});
