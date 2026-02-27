import amqp from 'amqplib';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

dotenv.config({ path: './.env' });

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const QUEUE_NAME = process.env.ORDER_CREATED_QUEUE;
const DATABASE_URL = process.env.DATABASE_URL;

const ordersTable = pgTable('orders', {
	id: uuid('id').primaryKey(),
	status: varchar('status', { length: 100 }).notNull(),
});

type OrderCreatedEvent = {
	orderId: string;
	userId: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function updateOrderStatus(
	dbClient: ReturnType<typeof drizzle>,
	orderId: string,
	status: string,
) {
	const updated = await dbClient
		.update(ordersTable)
		.set({ status })
		.where(eq(ordersTable.id, orderId))
		.returning({ id: ordersTable.id });

	if (!updated.length) {
		console.warn(
			`[order-processing-svc] No order found for id ${orderId} while updating to "${status}".`,
		);
		return;
	}

	console.log(
		`[order-processing-svc] Order ${orderId} status updated to "${status}".`,
	);
}

async function startConsumer() {
	if (!DATABASE_URL) {
		throw new Error('DATABASE_URL is required to update order status');
	}

	const dbPool = new Pool({ connectionString: DATABASE_URL });
	const dbClient = drizzle(dbPool);

	const connection = await amqp.connect(RABBITMQ_URL);
	const channel = await connection.createChannel();

	await channel.assertQueue(QUEUE_NAME, { durable: true });
	console.log(`[order-processing-svc] Listening on queue: ${QUEUE_NAME}`);

	channel.consume(
		QUEUE_NAME,
		async (msg) => {
			if (!msg) {
				return;
			}

			try {
				const payload = JSON.parse(msg.content.toString()) as OrderCreatedEvent;
				console.log('[order-processing-svc] Received order event:', payload);

				await updateOrderStatus(dbClient, payload.orderId, 'processing');
				await sleep(10000);

				console.log(
					`[order-processing-svc] Finished processing order ${payload.orderId} for user ${payload.userId}.`,
				);
				console.log(
					`[order-processing-svc] Dummy email sent to user ${payload.userId}: Your order ${payload.orderId} has been completed.`,
				);

				await updateOrderStatus(dbClient, payload.orderId, 'done');

				channel.ack(msg);
			} catch (error) {
				console.error('[order-processing-svc] Failed to process message:', error);
				channel.nack(msg, false, false);
			}
		},
		{ noAck: false },
	);

	process.on('SIGINT', async () => {
		console.log('\n[order-processing-svc] Shutting down consumer...');
		await channel.close();
		await connection.close();
		await dbPool.end();
		process.exit(0);
	});
}

startConsumer().catch((error) => {
	console.error('[order-processing-svc] Failed to start consumer:', error);
	process.exit(1);
});
