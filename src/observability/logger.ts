import pino from "pino";
import type { AppConfig } from "../config/env.js";

export function createLogger(config: Pick<AppConfig, "LOG_LEVEL" | "NODE_ENV">) {
  return pino({
    level: config.LOG_LEVEL,
    redact: {
      paths: [
        "req.headers.authorization",
        "req.headers.cookie",
        "password",
        "token",
        "accessToken",
        "refreshToken",
        "DATABASE_URL"
      ],
      censor: "[REDACTED]"
    },
    base: { service: "duhochanoi-cms-api", environment: config.NODE_ENV },
    timestamp: pino.stdTimeFunctions.isoTime
  });
}

export type AppLogger = ReturnType<typeof createLogger>;
