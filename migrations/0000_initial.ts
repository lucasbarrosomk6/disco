import { sql } from 'drizzle-orm';

export async function up(db: any) {
  await db.schema.createTable('__drizzle_migrations')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('hash', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();
}

export async function down(db: any) {
  await db.schema.dropTable('__drizzle_migrations').execute();
}