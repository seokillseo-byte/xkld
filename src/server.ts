import { createServer } from "node:http";
import pg from "pg";
import { createApp } from "./app.js";
import { loadConfig } from "./config/env.js";
import { createLogger } from "./observability/logger.js";

const config = loadConfig();
const logger = createLogger(config);
const pool = config.DATABASE_URL ? new pg.Pool({
  connectionString: config.DATABASE_URL,
  ...(config.DATABASE_SSL ? { ssl: { rejectUnauthorized: true } } : {})
}) : undefined;

const app = createApp({
  logger,
  readinessCheck: async () => {
    if (!pool) return false;
    const result = await pool.query("SELECT 1");
    return result.rowCount === 1;
  }
});

const server = createServer(app);
server.listen(config.PORT, () => logger.info({ port: config.PORT }, "server_started"));

async function shutdown(signal: string) {
  logger.info({ signal }, "server_shutdown_started");
  server.close(async (error) => {
    if (error) {
      logger.error({ errorName: error.name }, "server_shutdown_failed");
      process.exitCode = 1;
    }
    await pool?.end();
  });
}
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
