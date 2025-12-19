import { PartialType } from '@nestjs/mapped-types';
import { CreateDepositDto } from './create-deposit-transaction.dto';

export class UpdateDepositDto extends PartialType(CreateDepositDto) {}
