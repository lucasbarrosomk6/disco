import { sql } from 'drizzle-orm';
import { pgTable, jsonb } from 'drizzle-orm/pg-core';

export async function up(db: any) {
  await db.schema.alterTable('products').execute(table => [
    // First, add a new jsonb column
    table.addColumn('key_features_jsonb', jsonb('key_features_jsonb')),
    
    // Then, update the new column with the parsed data from the old column
    sql`UPDATE products SET key_features_jsonb = COALESCE(
      NULLIF(key_features, '')::jsonb,
      '[]'::jsonb
    )`,
    
    // Drop the old column
    table.dropColumn('key_features'),
    
    // Rename the new column to the original name
    sql`ALTER TABLE products RENAME COLUMN key_features_jsonb TO key_features`
  ]);
}

export async function down(db: any) {
  await db.schema.alterTable('products').execute(table => [
    // Revert the changes in reverse order
    sql`ALTER TABLE products RENAME COLUMN key_features TO key_features_jsonb`,
    table.addColumn('key_features', 'text'),
    sql`UPDATE products SET key_features = key_features_jsonb::text`,
    table.dropColumn('key_features_jsonb')
  ]);
}