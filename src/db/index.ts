// Drizzle ORM 클라이언트 — Sprint 0

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://crew_dev:crew_dev_pass@localhost:5432/saas_crew';

// 개발 환경에서는 max=1 (HMR로 인한 connection leak 방지)
const client = postgres(connectionString, {
  max: process.env.NODE_ENV === 'production' ? 10 : 1,
});

export const db = drizzle(client, { schema });
export { schema };
