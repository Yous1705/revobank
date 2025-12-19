import { UpdateUserDto } from './../user/dto/update-user.dto';
import { User } from './../user/entities/user.entity';
import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(dto: CreateUserDto) {
    const user = await this.userService.register(dto);

    const tokens = await this.getTokens(user.id, user.email, user.role);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Invalid password');
    }
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { message: 'Login successful', role: user.role, tokens };
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new Error('Access Denied');
    }

    const match = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!match) {
      throw new Error('Access Denied');
    }
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    const user = await this.userService.findById(userId);
    await this.userService.update(userId, { refreshToken: null });

    return { message: 'Logout successful', name: user.name };
  }

  private async updateRefreshToken(userId: number, token: string) {
    const hashed = await bcrypt.hash(token, 10);
    await this.userService.update(userId, { refreshToken: hashed });
  }

  private async getTokens(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET_KEY,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
