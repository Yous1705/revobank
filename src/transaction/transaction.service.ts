import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionService {
  constructor(private readonly repo: TransactionRepository) {}

  deposit(userId: number, accountNumber: string, amount: number) {
    return this.repo.deposit(userId, accountNumber, amount);
  }

  withdraw(userId: number, accountNumber: string, amount: number) {
    return this.repo.withdraw(userId, accountNumber, amount);
  }

  transfer(
    userId: number,
    fromAccountNumber: string,
    toAccountNumber: string,
    amount: number,
  ) {
    return this.repo.transfer(
      userId,
      fromAccountNumber,
      toAccountNumber,
      amount,
    );
  }

  getHistoryByAccount(userId: number) {
    return this.repo.findHistoryByAccount(userId);
  }
}
