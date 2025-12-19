import { PartialType } from '@nestjs/mapped-types';
import { CreateWithdrawDto } from './create-withdraw-transaction.dto';

export class UpdateWithdrawDto extends PartialType(CreateWithdrawDto) {}
