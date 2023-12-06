import { Body, Controller, Get, Ip, Post, Session, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { UserDto } from '../dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class AuthController {

  constructor(
    private authService: AuthService
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() user: User) {

    return user;
  }

  @Post('/register')
  async registerUser(@Body() registerUserDto: RegisterUserDto, @Session() session: any) {
    
    const registeredUser = await this.authService.register(registerUserDto);
    session.userId = registeredUser.id;

    return registeredUser;
  }

  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto, @Session() session: any) {
    
    const loggedInUser = await this.authService.login(loginUserDto);
    session.userId = loggedInUser.id;

    return loggedInUser;
  }

  @Get('/logout')
  logoutUser(@Session() session: any) {
    
    session.userId = null;
  }
}
