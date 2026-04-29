import type { Request } from 'express';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtToken } from './auth.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() authCredentialsDto: AuthCredentialsDto): Promise<JwtToken> {
    return this.authService.login(authCredentialsDto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  refreshToken(@Req() req: Request) {
    const userId = req.user?.['id'] as unknown as number;
    const refreshToken = req.user?.['refreshToken'] as unknown as string;

    return this.authService.refreshToken(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    const userId = user.id;
    return { message: `return profile of user ID ${userId}` };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }
}
