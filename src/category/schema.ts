import { uuid, pgTable, varchar } from 'drizzle-orm/pg-core';

import { menuItemsTable } from '../menu-items/schema';

export const categoryTable = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  menuItemId: uuid()
    .references(() => menuItemsTable.id)
    .notNull(),
  category: varchar({ length: 40 }).notNull(),
});
