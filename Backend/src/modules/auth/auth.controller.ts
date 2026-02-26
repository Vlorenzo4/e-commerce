import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDTO } from '../users/dto/create-user.dto';
import { LowercaseEmailInterceptor } from 'src/interceptors/lowercase-email/lowercase-email.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(LowercaseEmailInterceptor)
  @Post('signup')
  register(@Body() user: CreateUserDto) {
    return this.authService.createUser(user);
  }

  @UseInterceptors(LowercaseEmailInterceptor)
  @Post('signin')
  signin(@Body() credentials: LoginDTO) {
    return this.authService.signIn(credentials);
  }
}
