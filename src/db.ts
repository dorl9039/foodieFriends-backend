import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.HOSTNAME,
    password: process.env.PASSWORD,
    host: process.env.HOSTNAME,
    port: 5432,
    database: process.env.DATABASE_NAME
});

export default pool;