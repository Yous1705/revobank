import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;
  const serviceMock = {
    deposit: jest.fn(),
    withdraw: jest.fn(),
    transfer: jest.fn(),
    getHistoryByAccount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [{ provide: TransactionService, useValue: serviceMock }],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('deposit() should call service.deposit with req.user.sub and body', async () => {
    const req = { user: { sub: 5 } };
    const dto = { accountNumber: '111', amount: 100 };
    const expected = { ok: true };
    serviceMock.deposit.mockResolvedValue(expected);

    const res = await controller.deposit(req, dto);
    expect(serviceMock.deposit).toHaveBeenCalledWith(
      5,
      dto.accountNumber,
      dto.amount,
    );
    expect(res).toBe(expected);
  });

  it('history() should call service.getHistoryByAccount with user id', async () => {
    const req = { user: { sub: 7 } };
    const expected = [];
    serviceMock.getHistoryByAccount.mockResolvedValue(expected);

    const res = await controller.history(req);
    expect(serviceMock.getHistoryByAccount).toHaveBeenCalledWith(7);
    expect(res).toBe(expected);
  });
});
