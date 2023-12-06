import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FxModule } from './fx/fx.module';
import { FxRates } from './fx/entities/fx-rates.entity';
import { ScheduledRequestService } from './shared/scheduled-request.service';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { RequestStats } from './users/entities/request-stats.entity';
import { APP_PIPE } from '@nestjs/core';

const redisStore = require('cache-manager-redis-store').redisStore;
const cookieSession = require('cookie-session');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'postgres',
      username: 'postgres',
      entities: [FxRates, User, RequestStats],
      database: 'fx_db',
      synchronize: true,
      logging: true,
    }),
    FxModule, 
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      ttl: parseInt(process.env.REDIS_TTL_SECONDS),
      store: redisStore,
      url: process.env.REDIS_URL
    }),
    UsersModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    ScheduledRequestService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      cookieSession({
        keys: ['sdadsa']
      })
    )
    .forRoutes('*');
  }
}
