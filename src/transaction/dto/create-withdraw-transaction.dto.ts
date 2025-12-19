import { IsInt, IsPositive, IsString } from 'class-validator';

export class CreateWithdrawDto {
  @IsString()
  accountNumber: string;

  @IsPositive()
  amount: number;
}
