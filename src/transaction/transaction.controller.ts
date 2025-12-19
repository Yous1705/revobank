import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateWithdrawDto } from './dto/create-withdraw-transaction.dto';
import { CreateTransferDto } from './dto/create-transfer-transaction.dto';
import { CreateDepositDto } from './dto/create-deposit-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RoleValidatorGuard } from 'src/auth/guard/role-validator.guard';

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit')
  deposit(@Req() req, @Body() dto: CreateDepositDto) {
    return this.transactionService.deposit(
      req.user.sub,
      dto.accountNumber,
      dto.amount,
    );
  }

  @Post('withdraw')
  withdraw(@Req() req, @Body() dto: CreateWithdrawDto) {
    return this.transactionService.withdraw(
      req.user.sub,
      dto.accountNumber,
      dto.amount,
    );
  }

  @Post('transfer')
  transfer(@Req() req, @Body() dto: CreateTransferDto) {
    return this.transactionService.transfer(
      req.user.sub,
      dto.fromAccountNumber,
      dto.toAccountNumber,
      dto.amount,
    );
  }

  @Get('history')
  history(@Req() req) {
    return this.transactionService.getHistoryByAccount(req.user.sub);
  }
}
