import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { LoginUserDto } from '../dtos/login-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService
  ) {}

  async register(registerUserDto: RegisterUserDto) {

    const { username, password, confirmPassword } = registerUserDto;
    const users = await this.usersService.find(username);

    if (users.length) {
      throw new BadRequestException('username is already in use');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('passwords do not match');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    const user = await this.usersService.create(username, result);

    return user;
  }

  async login(loginUserDto: LoginUserDto) {

    const { username, password } = loginUserDto;
    const [user] = await this.usersService.find(username);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('wrong password');
    }

    return user;
  }
}