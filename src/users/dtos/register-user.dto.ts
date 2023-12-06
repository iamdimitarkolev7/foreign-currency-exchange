import { Equals, IsString } from 'class-validator';
import { AuthUserBaseDto } from './base/auth-user-base.dto';

export class RegisterUserDto extends AuthUserBaseDto {

  @IsString()
  confirmPassword: string;
}