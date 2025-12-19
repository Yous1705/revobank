import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Email not found');
    }
    return user;
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async register(data: {
    email: string;
    name: string;
    password: string;
    role?: string;
  }) {
    const exist = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (exist) {
      throw new ConflictException('Email already exists');
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashed,
        role: data.role ? (data.role as Role) : Role.USER,
      },
    });
    return user;
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }

  async updateUser(
    UserId: number,
    data: {
      email?: string;
      name?: string;
      password?: string;
      refreshToken?: string | null;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: UserId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.update({
      where: { id: UserId },
      data,
    });
  }
}
