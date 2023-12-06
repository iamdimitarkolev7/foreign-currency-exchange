import { Controller, Get, Param } from '@nestjs/common';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { UserDto } from '../dtos/user.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
@Serialize(UserDto)
export class UsersController {

  constructor(
    private usersService: UsersService
  ) {}

  @Get('/:id')
  getUserData(@Param('id') userId: number) {

    return this.usersService.findOne(userId);
  }
}
