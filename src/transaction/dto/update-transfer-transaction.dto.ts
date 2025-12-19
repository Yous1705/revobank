import { PartialType } from '@nestjs/mapped-types';
import { CreateTransferDto } from './create-transfer-transaction.dto';

export class UpdateTransferDto extends PartialType(CreateTransferDto) {}
