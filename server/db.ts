import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to configure une base locale?");
}

// Connexion à PostgreSQL en local
const sql = postgres(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
