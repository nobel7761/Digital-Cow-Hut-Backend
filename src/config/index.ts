import dotenv from 'dotenv';
import path from 'path';

//here we are joining the environment variable and this configure file. As this is not in the same directory. That is why we need to do this.
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
};
