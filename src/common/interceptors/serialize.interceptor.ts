import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common'
import { plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs'

interface ClassConstructor {
  new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {

  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {

  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

    return handler.handle().pipe(
      map((data: ClassConstructor) => {
        
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true
        });
      })
    );
  }
}