import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [DrizzleModule],
})
export class OrdersModule {}
