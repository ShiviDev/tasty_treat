import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createHmac } from 'crypto';
import { LoginCredDTO } from './dtos/login-cred.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(newUser: CreateUserDto) {
    const user = await this.usersService.createUser(newUser);
    if (!user) {
      throw new BadRequestException('Email is already in use');
    } else return user;
  }

  generateJWT(user) {
    return this.jwtService.sign(user);
  }

  async authenticateUser(cred: LoginCredDTO) {
    const result = await this.usersService.findUser(cred.email);
    //console.log(result);
    if (result) {
      const password = cred.password;
      const salt = result.salt;
      const hashedPassword = createHmac('sha256', salt)
        .update(password)
        .digest('hex');
      if (hashedPassword === result.password) {
        return {
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          token: this.generateJWT(result),
        };
      } else throw new BadRequestException('Email/password is incorrect');
    } else throw new NotFoundException('Email/password is incorrect');
  }
}
