import { Test } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LoginUserDto } from '../dtos/login-user.dto';

describe('Auth Service', () => {

  let authService: AuthService
  let _usersService: Partial<UsersService>

  beforeEach(async () => {

    let users: User[] = [];

    _usersService = {
      create: (username: string, password: string) => {

        const user = { id: 1, username, password, request_stats: [] };
        users.push(user);
        return Promise.resolve(user);
      },
      find: (username: string) => {

        const filteredUsers = users.filter(user => user.username === username);
        return Promise.resolve(filteredUsers);
      },
      findOne: (id: number) => {

        const [filteredUser] = users.filter(user => user.id === id);
        return Promise.resolve(filteredUser);
      }
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: _usersService
        }
      ]
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should throw an error when trying to register a user which already exists', async () => {
    
    const registerUserDto: RegisterUserDto = {
      username: 'kolev',
      password: 'kolev',
      confirmPassword: 'kolev'
    };

    _usersService.find = () => Promise.resolve([{ id: 5, username: 'kolev', password: 'kolev', request_stats: [] } as User]);
    
    await expect(authService.register(registerUserDto)).rejects.toThrow(BadRequestException);
  });

  it('should throw an error when trying to register with unmatching passwords', async () => {
    
    const registerUserDto: RegisterUserDto = { 
      username: 'kolev', 
      password: 'kolev', 
      confirmPassword: 'anotherPassword' 
    };

    await expect(authService.register(registerUserDto)).rejects.toThrow(BadRequestException);
  });

  it('should create a new user', async () => {
    
    const registerUserDto: RegisterUserDto = { 
      username: 'kolev', 
      password: 'kolev', 
      confirmPassword: 'kolev' 
    };

    const newUser = await authService.register(registerUserDto);

    const [salt, hash] = newUser.password.split('.');

    expect(newUser).toBeDefined();
    expect(newUser.password).not.toEqual('kolev');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throw an error when trying to log in with an unregistered user', async () => {

    const loginUserDto: LoginUserDto = {
      username: 'qwerty',
      password: 'asdfgh'
    };

    await expect(authService.login(loginUserDto)).rejects.toThrow(NotFoundException);
  });

  it('should throw an error when trying to login with a wrong password', async () => {

    const loginUserDto: LoginUserDto = {
      username: 'kolev',
      password: 'kolev789'
    };

    _usersService.find = () => Promise.resolve([{ id: 1, username: 'kolev', password: 'kolev', request_stats: [] }]);

    await expect(authService.login(loginUserDto)).rejects.toThrow(BadRequestException);
  });

  it('should successfully log in the user', async () => {

    const registerUserDto: RegisterUserDto = {
      username: 'kolev', 
      password: 'kolev', 
      confirmPassword: 'kolev'
    }

    await authService.register(registerUserDto);

    const loginUserDto: LoginUserDto = {
      username: 'kolev',
      password: 'kolev'
    };

    const loggedInUser = await authService.login(loginUserDto);
    
    expect(loggedInUser).toBeDefined();
    expect(loggedInUser.username).toEqual(loginUserDto.username);
  });
});