import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL is not set');
}

const sql = postgres(connectionString, { max: 1 });

async function main() {
  try {
    const migrationsFolder = path.join(process.cwd(), 'migrations');
    const metaFolder = path.join(migrationsFolder, 'meta');
    const journalPath = path.join(metaFolder, '_journal.json');
    
    // Create migrations and meta folders if they don't exist
    if (!fs.existsSync(migrationsFolder)) {
      fs.mkdirSync(migrationsFolder, { recursive: true });
    }
    if (!fs.existsSync(metaFolder)) {
      fs.mkdirSync(metaFolder, { recursive: true });
    }

    // Create or validate _journal.json
    if (!fs.existsSync(journalPath)) {
      fs.writeFileSync(journalPath, JSON.stringify({"version":"5","dialect":"pg","entries":[]}));
    } else {
      // Validate existing _journal.json
      try {
        JSON.parse(fs.readFileSync(journalPath, 'utf8'));
      } catch (error) {
        console.error('Invalid _journal.json file. Recreating...');
        fs.writeFileSync(journalPath, JSON.stringify({"version":"5","dialect":"pg","entries":[]}));
      }
    }

    await migrate(drizzle(sql), {
      migrationsFolder: migrationsFolder,
    });
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sql.end();
  }
}

main();
