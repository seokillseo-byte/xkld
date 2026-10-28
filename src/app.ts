import { randomUUID } from "node:crypto";
import { type ErrorRequestHandler, type RequestHandler, createServer } from "node:http";
import express from "express";
import type { AppLogger } from "./observability/logger.js";

export interface AppDependencies {
  logger: AppLogger;
  readinessCheck: () => Promise<boolean>;
}

export function createApp({ logger, readinessCheck }: AppDependencies) {
  const app = express();
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    const incoming = req.header("x-request-id");
    const requestId = incoming && /^[a-zA-Z0-9._-]{1,100}$/.test(incoming) ? incoming : randomUUID();
    res.setHeader("x-request-id", requestId);
    res.locals.requestId = requestId;
    const startedAt = Date.now();
    res.on("finish", () => {
      logger.info({
        requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        durationMs: Date.now() - startedAt
      }, "http_request");
    });
    next();
  });
  app.use(express.json({ limit: "32kb", strict: true }));

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.get("/api/health/ready", async (_req, res) => {
    try {
      const ready = await readinessCheck();
      if (!ready) {
        return res.status(503).json({ status: "not_ready", reason: "dependency_unavailable" });
      }
      return res.status(200).json({ status: "ready" });
    } catch {
      return res.status(503).json({ status: "not_ready", reason: "dependency_unavailable" });
    }
  });

  app.use((_req, res) => {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
  });

  const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
    logger.error({ requestId: res.locals.requestId, errorName: error instanceof Error ? error.name : "UnknownError" }, "request_failed");
    if (res.headersSent) return;
    res.status(400).json({ error: { code: "BAD_REQUEST", message: "Invalid request" } });
  };
  app.use(errorHandler as RequestHandler);

  return app;
}
