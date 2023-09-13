import { Database as DB } from '@/lib/database.types.ts';

declare global {
  type Database = DB;
}
