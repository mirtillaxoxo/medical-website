import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text().primaryKey(),

  name: text().notNull(),
  surname: text().notNull(),
  email: text().notNull(),
  telephone: text().notNull(),
  address: text(),
  privacy_policy_date: text().notNull(),

  exam_name: text(),
  datetime: text(),
  struttura: text(),
  priceDisplay: text(),
  source: text(),
  structure_id: text(),
})
