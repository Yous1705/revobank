import { Role } from '@prisma/client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async register(dto: CreateUserDto) {
    return this.repo.register(dto);
  }

  async findAll() {
    return this.repo.findAll();
  }

  findById(id: number) {
    return this.repo.findById(id);
  }

  findByEmail(email: string) {
    return this.repo.findByEmail(email);
  }

  async update(
    userID: number,
    data: {
      email?: string;
      name?: string;
      password?: string;
      refreshToken?: string | null;
    },
  ) {
    return this.repo.updateUser(userID, data);
  }
}
