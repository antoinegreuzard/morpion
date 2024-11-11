// utils/db.ts
import {Pool} from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

type QueryParams = (string | number | boolean | null)[];

export const query = (text: string, params?: QueryParams) => {
  return pool.query(text, params);
};

