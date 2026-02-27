import { IsEmail, IsString } from 'class-validator';
export class LoginCredDTO {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
