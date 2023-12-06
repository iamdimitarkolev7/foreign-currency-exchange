import { IsString, Length } from 'class-validator';

export class AuthUserBaseDto {

  @Length(3, 20)
  username: string;

  @IsString()
  password: string;
}