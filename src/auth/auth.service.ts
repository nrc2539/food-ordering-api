import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/users/entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload, JwtToken } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async login(authCredentialsDto: AuthCredentialsDto): Promise<JwtToken> {
    const { email, password } = authCredentialsDto;

    const user = await this.userRepository.findOne({ where: { email: email } });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Please check your credential');
      }
      const payload: JwtPayload = { email };
      const accessToken: string = this.jwtService.sign(payload, {
        expiresIn: '4h',
      });
      const refreshToken: string = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      await this.setCurrentRefreshTokenToUser({
        refreshToken,
        userId: user.id.toString(),
      });

      return { accessToken, refreshToken };
    } else {
      throw new UnauthorizedException('Please check your credential');
    }
  }

  async validateUser(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'refreshToken'], // DESC: select only necessary fields
    });
    return user;
  }

  private async setCurrentRefreshTokenToUser({
    refreshToken,
    userId,
  }: {
    refreshToken: string;
    userId: string;
  }): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
