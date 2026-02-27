import { uuid, pgTable, varchar } from 'drizzle-orm/pg-core';
import { usersTable } from '../users/schema';

export const addressTable = pgTable('addresses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => usersTable.id),
  address1: varchar({ length: 200 }).notNull(),
  address2: varchar({ length: 200 }),
  city: varchar({ length: 200 }).notNull(),
  fullName: varchar({ length: 200 }).notNull(),
  phone: varchar({ length: 200 }).notNull(),
  state: varchar({ length: 200 }),
  country: varchar({ length: 200 }),
  postalCode: varchar({ length: 200 }).notNull(),
});
