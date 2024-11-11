import {Pool} from "pg";

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? {rejectUnauthorized: false} : false,
});

type QueryParams = (string | number | boolean | null)[];

export const query = (text: string, params?: QueryParams) => {
  return pool.query(text, params);
};
