import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { UsersController } from './users.controller';
import { User } from '../entities/user.entity';

describe('Users Controller', () => {

  let usersController: UsersController;
  let _usersService: Partial<UsersService>;

  beforeEach(async () => {

    let users: User[] = [];

    _usersService = {
      
      create(username, password) {

        const user = { id: 1, username, password, request_stats: [] };
        users.push(user);
        return Promise.resolve(user);
      },
      findOne: (id: number) => {
        
        const [filteredUser] = users.filter(user => user.id === id);
        return Promise.resolve(filteredUser);
      },
    }

    const module: TestingModule = await Test.createTestingModule({
      
      controllers: [
        UsersController
      ],
      providers: [
        {
          provide: UsersService,
          useValue: _usersService
        }
      ]
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should return users data', async () => {

    const newUser = await _usersService.create('kolev', 'kolev')
    const user = await usersController.getUserData(newUser.id);

    expect(user).toBeDefined();
    expect(user.username).toEqual(newUser.username);
    expect(user.id).toEqual(newUser.id);
  });
});