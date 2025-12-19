import { Account } from './../account/entities/account.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async deposit(userId: number, accountNumber: string, amount: number) {
    const account = await this.findAccountByNumber(accountNumber);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new BadRequestException('Account does not belong to user');
    }

    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: account.id },
        data: {
          balance: { increment: new Prisma.Decimal(amount) },
        },
      }),
      this.prisma.transaction.create({
        data: {
          type: TransactionType.DEPOSIT,
          amount: new Prisma.Decimal(amount),
          accountId: account.id,
        },
      }),
    ]);
  }

  async withdraw(userId: number, accountNumber: string, amount: number) {
    const account = await this.findAccountByNumber(accountNumber);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== userId) {
      throw new BadRequestException('Account does not belong to user');
    }

    if (account.balance.lessThan(amount)) {
      throw new Error('Insufficient balance');
    }

    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: account.id },
        data: {
          balance: { decrement: new Prisma.Decimal(amount) },
        },
      }),
      this.prisma.transaction.create({
        data: {
          type: TransactionType.WITHDRAW,
          amount: new Prisma.Decimal(amount),
          accountId: account.id,
        },
      }),
    ]);
  }

  async transfer(
    userId: number,
    fromAccountNumber: string,
    toAccountNumber: string,
    amount: number,
  ) {
    if (fromAccountNumber === toAccountNumber) {
      throw new BadRequestException('Cannot transfer to the same account');
    }

    const [from, to] = await Promise.all([
      this.findAccountByNumber(fromAccountNumber),
      this.findAccountByNumber(toAccountNumber),
    ]);

    if (!from || !to) {
      throw new NotFoundException('One or both accounts not found');
    }

    if (from.userId !== userId) {
      throw new BadRequestException('Account does not belong to user');
    }

    if (from.balance.lessThan(amount)) {
      throw new BadRequestException('Insufficient balance');
    }

    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: from.id },
        data: {
          balance: { decrement: new Prisma.Decimal(amount) },
        },
      }),

      this.prisma.account.update({
        where: { id: to.id },
        data: {
          balance: { increment: new Prisma.Decimal(amount) },
        },
      }),

      this.prisma.transaction.create({
        data: {
          type: TransactionType.TRANSFER,
          amount: new Prisma.Decimal(amount),
          accountId: from.id,
          fromAccountId: from.id,
          toAccountId: to.id,
        },
      }),

      this.prisma.transaction.create({
        data: {
          type: TransactionType.TRANSFER,
          amount: new Prisma.Decimal(amount),
          accountId: to.id,
          fromAccountId: from.id,
          toAccountId: to.id,
        },
      }),
    ]);
  }

  private async findAccountByNumber(accountNumber: string) {
    return this.prisma.account.findUnique({
      where: { accountNumber },
    });
  }

  findHistoryByAccount(userId: number) {
    return this.prisma.transaction.findMany({
      where: {
        account: {
          userId: userId,
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        account: {
          select: {
            accountNumber: true,
          },
        },
      },
    });
  }
}
