import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.prisma.account.create({
      data: {
        userId,
        accountNumber: this.generateAccountNumber(),
      },
      select: {
        id: true,
        accountNumber: true,
        balance: true,
        createdAt: true,
      },
    });
  }

  async findAccountByUserId(userId: number) {
    const account = await this.prisma.account.findMany({
      where: { userId },
    });

    if (!account) {
      throw new Error('Account not found');
    }
    return account;
  }

  findByUser(userId: number) {
    return this.prisma.account.findMany({
      where: { userId },
      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
        accountNumber: true,
        balance: true,
        createdAt: true,
      },
    });
  }

  private generateAccountNumber(): string {
    return Math.random().toString().slice(2, 12);
  }
}
