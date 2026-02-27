import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
