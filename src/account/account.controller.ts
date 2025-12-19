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
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RoleValidatorGuard } from 'src/auth/guard/role-validator.guard';

@UseGuards(JwtAuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('createAccount')
  create(@Req() req) {
    return this.accountService.createAccount(req.user.sub);
  }

  @Get('account')
  getUserAccount(@Req() req) {
    return this.accountService.getUserAccount(req.user.sub);
  }
}
