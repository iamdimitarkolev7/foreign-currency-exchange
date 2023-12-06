import { Injectable, NestMiddleware } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { NextFunction, Response, Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      session?: any;
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  
  constructor(private usersService: UsersService) {}
  
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findOne(parseInt(userId));
      req.currentUser = user;
    }

    next();
  }
}