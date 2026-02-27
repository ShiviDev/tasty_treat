import { uuid, pgTable, varchar, json } from 'drizzle-orm/pg-core';
import { usersTable } from '../users/schema';
import { addressTable } from 'src/address/schema';

export const ordersTable = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => usersTable.id),
  address: uuid('addressId')
    .notNull()
    .references(() => addressTable.id),
  amounts: json(),
  paymentMethod: varchar({ length: 100 }).notNull(),
  status: varchar({ length: 100 }).notNull(),
});
