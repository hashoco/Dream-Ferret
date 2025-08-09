import pg from 'pg';
const { Pool } = pg;

// 우선순위 1: DATABASE_URL 사용 (가장 안전)
const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? new Pool({ connectionString })
  : new Pool({
      host: process.env.PG_HOST || 'db',     // ← 컨테이너에선 'db'
      port: Number(process.env.PG_PORT) || 5432,
      user: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || '1234',
      database: process.env.PG_DATABASE || 'dreamferretdb',
    });

// 통일된 인터페이스
export default {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
