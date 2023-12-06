import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  create(username: string, password: string) {

    const user = this.userRepository.create({ username, password, request_stats: [] });
    return this.userRepository.save(user);
  }

  async findOne(id: number) {

    if (!id) {
      return null;
    }

    return await this.userRepository.findOneBy({ id });
  }

  async find(username: string) {

    return this.userRepository.find({ where: { username } });
  }
}
