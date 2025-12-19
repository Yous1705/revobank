import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @IsString({ message: 'Name harus berupa string' })
  name: string;

  @IsString({ message: 'Password harus berupa string' })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
