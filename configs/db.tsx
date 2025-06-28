// import { drizzle } from 'drizzle-orm/neon-http';
// export const db = drizzle(process.env.NEXT_PUBLIC_NEON_DB_CONNECTION_STRING!);


import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const sql = neon(process.env.NEXT_PUBLIC_NEON_DB_CONNECTION_STRING!); 

export const db = drizzle(sql, { schema });
