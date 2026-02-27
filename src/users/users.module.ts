import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'jwt.config';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  imports: [
    DrizzleModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class UsersModule {}
