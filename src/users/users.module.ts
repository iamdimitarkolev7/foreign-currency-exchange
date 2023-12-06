import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { AuthController } from './controllers/auth.controller';
import { CurrentUserMiddleware } from '../common/middlewares/current-user.middleware';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RequestStats } from './entities/request-stats.entity';
import { RequestStatsService } from './services/request-stats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RequestStats])
  ],
  controllers: [
    UsersController, 
    AuthController
  ],
  exports: [
    RequestStatsService
  ],
  providers: [
    UsersService,
    AuthService,
    RequestStatsService
  ]
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
