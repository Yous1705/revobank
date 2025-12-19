import { IsPositive, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsPositive()
  userId: number;
}
