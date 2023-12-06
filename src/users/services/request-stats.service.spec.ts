import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RequestStatsService } from './request-stats.service';
import { RequestStats } from '../entities/request-stats.entity';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';

describe('Request Stats Service', () => {

  let requestStatsService: RequestStatsService;
  let requestStatsRepository: Repository<RequestStats>;
  let requestStatsRepositoryToken: string | Function = getRepositoryToken(RequestStats);
  let _usersService: Partial<UsersService>;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestStatsService,
        {
          provide: requestStatsRepositoryToken,
          useClass: Repository
        },
        {
          provide: UsersService,
          useValue: _usersService
        }
      ]
    }).compile();

    requestStatsService = module.get<RequestStatsService>(RequestStatsService);
    requestStatsRepository = module.get<Repository<RequestStats>>(requestStatsRepositoryToken);
  });

  it('should be defined', () => {
    expect(requestStatsService).toBeDefined();
    expect(requestStatsRepository).toBeDefined();
  });

  it('should save request stats', async () => {

    const user = { id: 5, username: 'kolev', password: 'kolev', request_stats: [] };
    const createdStat: RequestStats = { id: 1, user_agent: 'Chrome', ip: ':1', user };

    jest.spyOn(requestStatsRepository, 'create').mockReturnValueOnce(createdStat);
    jest.spyOn(requestStatsRepository, 'save').mockResolvedValueOnce(createdStat);

    const requestStat = await requestStatsService.saveRequestStats(user.id, createdStat.ip, createdStat.user_agent);

    expect(requestStat).toBeDefined();
    expect(requestStat).toEqual(createdStat);
  });
});