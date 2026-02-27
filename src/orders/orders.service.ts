import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import * as ordersSchema from './schema';
import * as orderItemsSchema from '../orderItems/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { OrderDTO } from './dtos/orders.dto';
import { addressTable } from 'src/address/schema';
import amqp from 'amqplib';

@Injectable()
export class OrdersService {
  private readonly orderCreatedQueue = 'order.created';

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
        qty: Number(orderItems[i].qty),
        unitPrice: String(orderItems[i].price),
        menutItemId: orderItems[i].id,
      });
    }

    await this.publishOrderCreatedEvent({
      orderId: orderCreated.id,
      userId,
      paymentMethod,
      amounts,
      itemsCount: orderItems.length,
    });

    return {
      message: 'Order created successfully',
      orderCreated,
      address: newAddress,
    };
  }

  private async publishOrderCreatedEvent(payload: {
    orderId: string;
    userId: string;
    paymentMethod: string;
    amounts: unknown;
    itemsCount: number;
  }) {
    const rabbitUrl =
      process.env.RABBITMQ_URL ?? 'amqp://user:password@localhost:5672';
    let connection: amqp.ChannelModel | undefined;
    let channel: amqp.Channel | undefined;

    try {
      connection = await amqp.connect(rabbitUrl);
      channel = await connection.createChannel();
      await channel.assertQueue(this.orderCreatedQueue, { durable: true });

      const message = {
        type: 'ORDER_CREATED',
        createdAt: new Date().toISOString(),
        ...payload,
      };

      channel.sendToQueue(
        this.orderCreatedQueue,
        Buffer.from(JSON.stringify(message)),
        { persistent: true },
      );

      console.log('Published ORDER_CREATED event:', message);
    } catch (error) {
      console.error('Failed to publish ORDER_CREATED event:', error);
    } finally {
      await channel?.close();
      await connection?.close();
    }
  }
}
