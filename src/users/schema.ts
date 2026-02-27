import { uuid, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  salt: varchar({ length: 800 }).notNull(),
});

export const userSessions = pgTable('user_sessions', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .references(() => usersTable.id)
    .notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

export interface AuthUser {
  sessionId: string | null;
  userId: string | null; // session.userId or your users.id
  id: string | null;
  firstName: string | null;
  email: string | null;
}
