import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { DrizzleQueryError } from 'drizzle-orm';
import { LoginCredDTO } from './dtos/login-cred.dto';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/auth/auth.guards';

@Controller('auth')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    console.log(body);
    return this.authService.signup(body);
  }

  @Get()
  async findUser(email: string) {
    return this.usersService.findUser(email);
  }

  @Post('/login')
  async loginUser(@Body() body: LoginCredDTO, @Session() session: any) {
    const user = await this.authService.authenticateUser(body);
    if (user && user.id) {
      console.log(user.id + 'inside set session');
      session.userId = user.id;
      await new Promise<void>((resolve, reject) => {
        session.save((err) => {
          if (err) reject(err);
          resolve();
        });
      });
    }
    return user;
  }

  @Post('/logout')
  async logoutUser(@Session() session: any, @Res() res: Response) {
    session.destroy();
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out' });
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
