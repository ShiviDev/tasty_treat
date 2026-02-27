import { uuid, pgTable, varchar, integer } from 'drizzle-orm/pg-core';

export const menuItemsTable = pgTable('menuItems', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  image: varchar({ length: 244 }).notNull(),
  price: varchar({ length: 244 }).notNull(),
  course: varchar({ length: 255 }).notNull(),
  classification: varchar({ length: 255 }).notNull(),
});
