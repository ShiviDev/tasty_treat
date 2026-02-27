import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDTO } from './dtos/orders.dto';

@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/createOrder')
  createOrder(@Body() body: OrderDTO) {
    return this.ordersService.createOrder(body);
  }
}
