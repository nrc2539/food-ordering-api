import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from 'src/users/entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload, JwtToken } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
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

      const { accessToken, refreshToken } = await this.generateNewTokens(email);

      await this.setCurrentRefreshTokenToUser({
        refreshToken,
        userId: user.id.toString(),
      });

      return { accessToken, refreshToken };
    } else {
      throw new UnauthorizedException('Please check your credential');
    }
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { refreshToken: null });
    return { message: 'Logged out successfully.' };
  }

  async refreshToken(userId: number, refreshTokenFromHeader: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'refreshToken'],
    });

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const hashedRefreshTokenFromHeader = this.hashToken(refreshTokenFromHeader);

    if (hashedRefreshTokenFromHeader !== user.refreshToken)
      throw new ForbiddenException('Invalid Refresh Token');

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.generateNewTokens(user.email);

    await this.setCurrentRefreshTokenToUser({
      refreshToken: newRefreshToken,
      userId: user.id.toString(),
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async validateUser(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email'], // DESC: select only necessary fields
      relations: ['role'], // DESC: include role relation
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
    const hashedRefreshToken = this.hashToken(refreshToken);
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async generateNewTokens(email: string) {
    const payload: JwtPayload = { email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '4h',
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
