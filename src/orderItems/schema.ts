import { uuid, pgTable, integer } from 'drizzle-orm/pg-core';
import { ordersTable } from '../orders/schema';
import { varchar } from 'drizzle-orm/pg-core';
import { menuItemsTable } from 'src/menu-items/schema';

export const orderItemsTable = pgTable('orderItems', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid()
    .notNull()
    .references(() => ordersTable.id),
  menutItemId: uuid()
    .references(() => menuItemsTable.id)
    .notNull(),
  qty: integer(),
  unitPrice: varchar(),
});
