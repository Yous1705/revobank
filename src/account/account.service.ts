import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountService {
  constructor(private readonly repo: AccountRepository) {}

  createAccount(userId: number) {
    return this.repo.createAccount(userId);
  }

  getUserAccount(userId: number) {
    return this.repo.findByUser(userId);
  }
}
