import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginDto } from './dtos/login.dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Registro de usuarios (app móvil / web)
  @Post('register')
  registerUser(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
  }

  // Login usuario normal (app)
  @Post('login/user')
  loginUser(@Body() dto: LoginDto) {
    return this.authService.loginUser(dto);
  }

  // Login dueño de restaurante (dashboard web)
  @Post('login/restaurant')
  loginRestaurant(@Body() dto: LoginDto) {
    return this.authService.loginRestaurant(dto);
  }
}
