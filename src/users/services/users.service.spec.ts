import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Users Service', () => {

  let usersService: UsersService;
  let userRepository: Repository<User>;
  let userRepositoryToken: string | Function = getRepositoryToken(User);

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: userRepositoryToken,
          useClass: Repository
        }
      ]
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);     
  });

  it('can create an instance of the user service', () => {
    expect(usersService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('can create an instance of the user object', async () => {

    const username = 'kolev';
    const password = 'kolev';
    const createdUser = { id: 1, username: 'kolev', password: 'kolev', request_stats: [] };

    jest.spyOn(userRepository, 'create').mockReturnValueOnce(createdUser);
    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(createdUser);

    const user = await usersService.create(username, password);

    expect(user).toBeDefined();
    expect(user).toEqual(createdUser);
  });

  it('can find a user by its id', async () => {

    const userId = 1;
    const existingUser = { id: 1, username: 'kolev', password: 'kolev', request_stats: [] };

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(existingUser);

    const user = await usersService.findOne(userId);

    expect(user).toBeDefined();
    expect(user).toEqual(existingUser);
  });

  it('returns null when there is no user with such id in the database', async () => {

    const userId = 234;

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(null);

    const user = await usersService.findOne(userId);
    
    expect(user).toBeNull();
  });

  it('can find a user by username', async () => {
    
    const username = 'kolev';
    const existingUser = [{ id: 1, username: 'kolev', password: 'kolev', request_stats: [] }];

    jest.spyOn(userRepository, 'find').mockResolvedValueOnce(existingUser);

    const user = await usersService.find(username);

    expect(user).toBeDefined();
    expect(user).toHaveLength(1);
    expect(user).toEqual(existingUser);
  });
});