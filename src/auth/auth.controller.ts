import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtToken } from './auth.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from 'src/access-control/guards/roles.guard';
import { Roles } from 'src/access-control/decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() authCredentialsDto: AuthCredentialsDto): Promise<JwtToken> {
    return this.authService.login(authCredentialsDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('profile')
  getProfile() {
    return { message: 'This is a protected route test guard' };
  }
}
