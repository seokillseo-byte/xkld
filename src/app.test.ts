import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import test from "node:test";
import type { AddressInfo } from "node:net";
import { createApp } from "./app.js";
import { loadConfig } from "./config/env.js";
import { createLogger } from "./observability/logger.js";

async function withServer(readinessCheck: () => Promise<boolean>, run: (baseUrl: string) => Promise<void>) {
  const config = loadConfig({ NODE_ENV: "test", LOG_LEVEL: "silent" });
  const app = createApp({ logger: createLogger(config), readinessCheck });
  const server = createServer(app);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address() as AddressInfo;
  try {
    await run("http://127.0.0.1:" + address.port);
  } finally {
    server.close();
    await once(server, "close");
  }
}

test("GET /api/health returns a stable healthy response and request ID", async () => {
  await withServer(async () => true, async (baseUrl) => {
    const response = await fetch(baseUrl + "/api/health");
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
    assert.ok(response.headers.get("x-request-id"));
  });
});

test("GET /api/health/ready returns ready when dependency check passes", async () => {
  await withServer(async () => true, async (baseUrl) => {
    const response = await fetch(baseUrl + "/api/health/ready");
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ready" });
  });
});

test("GET /api/health/ready returns safe 503 when dependency is unavailable", async () => {
  await withServer(async () => false, async (baseUrl) => {
    const response = await fetch(baseUrl + "/api/health/ready");
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { status: "not_ready", reason: "dependency_unavailable" });
  });
});

test("unknown routes return a stable JSON error", async () => {
  await withServer(async () => true, async (baseUrl) => {
    const response = await fetch(baseUrl + "/not-a-route");
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: { code: "NOT_FOUND", message: "Route not found" } });
  });
});

test("environment validation reports invalid field names without echoing secrets", () => {
  assert.throws(() => loadConfig({ PORT: "not-a-port", DATABASE_URL: "postgres://user:secret@host/db" }), (error: unknown) => {
    assert.ok(error instanceof Error);
    assert.match(error.message, /PORT/);
    assert.doesNotMatch(error.message, /secret|postgres/);
    return true;
  });
});
