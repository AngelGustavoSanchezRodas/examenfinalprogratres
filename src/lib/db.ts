import sql from "mssql";

const sqlConfig = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  server: process.env.DB_SERVER!,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Next.js (especially in development) clears Node.js cache frequently.
// To avoid creating too many connection pools, we cache it on the global object.
const globalForSql = globalThis as unknown as {
  sqlPool: sql.ConnectionPool | undefined;
};

export const getConnectionPool = async () => {
  if (!globalForSql.sqlPool) {
    globalForSql.sqlPool = new sql.ConnectionPool(sqlConfig);
    await globalForSql.sqlPool.connect();
  }
  return globalForSql.sqlPool;
};
