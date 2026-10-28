import express from "express";
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
    const client = await pool.connect();
    client.release();
    return true;
  }
});

const server = express();
server.use(app);
server.listen(config.PORT, () => logger.info({ port: config.PORT }, "server_started"));
