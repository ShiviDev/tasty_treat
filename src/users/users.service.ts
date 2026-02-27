import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import * as schema from './schema';
import { createHmac, randomBytes } from 'crypto';
import { CreateUserDto } from './dtos/create-user.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async createUser(user: CreateUserDto) {
    const { email, firstName, lastName, password } = user;
    const salt = randomBytes(256).toString('hex');
    const hashedPassword = createHmac('sha256', salt)
      .update(password)
      .digest('hex');
    try {
      return await this.database
        .insert(schema.usersTable)
        .values({ email, lastName, firstName, password: hashedPassword, salt });
    } catch (err) {
      throw new BadRequestException('Email is already in use');
    }
  }

  async findUser(email: string) {
    return this.database.query.usersTable.findFirst({
      where: eq(schema.usersTable.email, email),
    });
  }
}
