import assert from "node:assert/strict";
import test from "node:test";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;

test("initial identity migration creates expected tables and foreign keys", { skip: !connectionString }, async () => {
  const pool = new pg.Pool({ connectionString });
  try {
    const tables = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY($1::text[])",
      [["users", "roles", "permissions", "user_roles", "role_permissions", "sessions", "audit_logs", "pgmigrations"]]
    );
    const found = new Set(tables.rows.map((row: { table_name: string }) => row.table_name));
    for (const name of ["users", "roles", "permissions", "user_roles", "role_permissions", "sessions", "audit_logs", "pgmigrations"]) {
      assert.ok(found.has(name), "expected migration table: " + name);
    }

    const foreignKeys = await pool.query(
      "SELECT COUNT(*)::int AS count FROM information_schema.table_constraints WHERE constraint_schema = 'public' AND constraint_type = 'FOREIGN KEY' AND table_name = ANY($1::text[])",
      [["user_roles", "role_permissions", "sessions", "audit_logs"]]
    );
    assert.ok(foreignKeys.rows[0].count >= 5);
  } finally {
    await pool.end();
  }
});
