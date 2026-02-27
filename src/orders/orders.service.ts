import { Inject, Injectable, Session } from '@nestjs/common';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import * as ordersSchema from './schema';
import * as orderItemsSchema from '../orderItems/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { OrderDTO } from './dtos/orders.dto';
import { addressTable } from 'src/address/schema';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly database: NodePgDatabase<
      typeof ordersSchema & typeof orderItemsSchema
    >,
  ) {}

  async createOrder(order: OrderDTO) {
    const { address, userId, amounts, paymentMethod, orderItems } = order;
    console.log('inside order service: ', order);
    const [newAddress] = await this.database
      .insert(addressTable)
      .values({
        userId,
        fullName: address.fullName,
        address1: address.address1,
        address2: address.address2 || null,
        city: address.city,
        state: address.state || null,
        postalCode: address.postalCode,
        phone: address.phone,
      })
      .returning();

    const [orderCreated] = await this.database
      .insert(ordersSchema.ordersTable)
      .values({
        userId,
        address: newAddress.id,
        paymentMethod,
        status: 'pending',
        amounts,
      })
      .returning();

    for (let i = 0; i < orderItems.length; i++) {
      await this.database.insert(orderItemsSchema.orderItemsTable).values({
        orderId: orderCreated.id,
        qty: orderItems[i].qty,
        unitPrice: Number(orderItems[i].price),
        menutItemId: orderItems[i].id,
      });
    }
    return {
      message: 'Order created successfully',
      orderCreated,
      address: newAddress,
    };
  }
}
