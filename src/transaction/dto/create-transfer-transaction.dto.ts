import { IsInt, IsPositive, IsString } from 'class-validator';

export class CreateTransferDto {
  @IsString()
  fromAccountNumber: string;

  @IsString()
  toAccountNumber: string;

  @IsPositive()
  amount: number;
}
