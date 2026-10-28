import express from "express";
import { createApp } from "./app.js";
import { loadConfig } from "./config/env.js";
import { createLogger } from "./observability/logger.js";

const config = loadConfig();
const logger = createLogger(config);
const app = createApp({ logger, readinessCheck: async () => Boolean(config.DATABASE_URL) });
app.listen(config.PORT, () => logger.info({ port: config.PORT }, "server_started"));
