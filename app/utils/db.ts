import { Pool } from 'pg';

// Pool de Postgres (Neon). Reutilizado entre hot-reloads en dev.
const globalForPg = global as unknown as { _pgPool?: Pool };

export const pool =
  globalForPg._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPg._pgPool = pool;
}
