import { IsInt, IsPositive, IsString } from 'class-validator';

export class CreateDepositDto {
  @IsString()
  accountNumber: string;

  @IsPositive()
  amount: number;
}
