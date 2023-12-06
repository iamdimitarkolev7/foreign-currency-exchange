import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';

describe('Auth Controller', () => {

  let authController: AuthController;
  let _authService: Partial<AuthService>;

  beforeEach(async () => {

    _authService = {

      register: (registerUserDto) => { 
        return Promise.resolve({ id: 1, username: registerUserDto.username, password: registerUserDto.password } as User);
      },
      login: (loginUserDto) => {
        return Promise.resolve({ id: 1, username: loginUserDto.username, password: loginUserDto.password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      
      controllers: [
        AuthController,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: _authService
        }
      ]
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should register user successfully', async () => {

    const session = {};
    const registerUserDto: RegisterUserDto = {
      username: 'kolev',
      password: 'kolev',
      confirmPassword: 'kolev'
    };
    const user = await authController.registerUser(registerUserDto, session);
    
    expect(user).toBeDefined();
    expect(session['userId']).toBeDefined();
    expect(session['userId']).toEqual(user.id);
  });

  it('should login user successfully', async () => {

    const session = {};
    const loginUserDto: LoginUserDto = {
      username: 'kolev',
      password: 'kolev',
    };
    const user = await authController.loginUser(loginUserDto, session);
    
    expect(user).toBeDefined();
    expect(session['userId']).toBeDefined();
    expect(session['userId']).toEqual(user.id);
  });

  it('should logout user successfully', async () => {

    const session = {};
    const loginUserDto: LoginUserDto = {
      username: 'kolev',
      password: 'kolev',
    };
    const user = await authController.loginUser(loginUserDto, session);
    
    expect(user).toBeDefined();
    expect(session['userId']).toBeDefined();
    expect(session['userId']).toEqual(user.id);

    authController.logoutUser(session);

    expect(session['userId']).toEqual(null);
  });

  it('should return the current logged in user', async () => {

    const session = {};
    const loginUserDto: LoginUserDto = {
      username: 'kolev',
      password: 'kolev',
    };
    const user = await authController.loginUser(loginUserDto, session);
    
    expect(user).toBeDefined();
    expect(session['userId']).toBeDefined();
    expect(session['userId']).toEqual(user.id);

    const currentUser = authController.getCurrentUser(user);

    expect(currentUser).toBeDefined();
    expect(currentUser.username).toEqual(user.username);
  });
});