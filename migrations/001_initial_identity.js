export async function up(pgm) {
  pgm.createTable("users", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    email: { type: "varchar(320)", notNull: true, unique: true },
    password_hash: { type: "text", notNull: true },
    display_name: { type: "varchar(160)", notNull: true },
    status: { type: "varchar(20)", notNull: true, default: "ACTIVE", check: "status IN ('ACTIVE', 'DISABLED', 'LOCKED')" },
    last_login_at: { type: "timestamptz" },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") }
  });
  pgm.createTable("roles", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    key: { type: "varchar(80)", notNull: true, unique: true },
    name: { type: "varchar(120)", notNull: true },
    description: { type: "text" },
    system_role: { type: "boolean", notNull: true, default: true },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") }
  });
  pgm.createTable("permissions", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    key: { type: "varchar(120)", notNull: true, unique: true },
    description: { type: "text" }
  });
  pgm.createTable("user_roles", {
    user_id: { type: "uuid", notNull: true, references: "users(id)", onDelete: "CASCADE" },
    role_id: { type: "uuid", notNull: true, references: "roles(id)", onDelete: "RESTRICT" },
    granted_by: { type: "uuid", references: "users(id)", onDelete: "SET NULL" },
    granted_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") }
  });
  pgm.addConstraint("user_roles", "user_roles_pkey", { primaryKey: ["user_id", "role_id"] });
  pgm.createTable("role_permissions", {
    role_id: { type: "uuid", notNull: true, references: "roles(id)", onDelete: "CASCADE" },
    permission_id: { type: "uuid", notNull: true, references: "permissions(id)", onDelete: "CASCADE" }
  });
  pgm.addConstraint("role_permissions", "role_permissions_pkey", { primaryKey: ["role_id", "permission_id"] });
  pgm.createTable("sessions", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    user_id: { type: "uuid", notNull: true, references: "users(id)", onDelete: "CASCADE" },
    hashed_session_token: { type: "varchar(128)", notNull: true, unique: true },
    expires_at: { type: "timestamptz", notNull: true },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
    last_seen_at: { type: "timestamptz" },
    revoked_at: { type: "timestamptz" }
  });
  pgm.createIndex("sessions", "user_id");
  pgm.createIndex("sessions", "expires_at");
  pgm.createTable("audit_logs", {
    id: { type: "bigserial", primaryKey: true },
    actor_id: { type: "uuid", references: "users(id)", onDelete: "SET NULL" },
    action: { type: "varchar(120)", notNull: true },
    resource_type: { type: "varchar(120)", notNull: true },
    resource_id: { type: "varchar(160)" },
    outcome: { type: "varchar(40)", notNull: true },
    request_id: { type: "varchar(100)" },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
    redacted_metadata: { type: "jsonb", notNull: true, default: pgm.func("'{}'::jsonb") }
  });
  pgm.createIndex("audit_logs", ["resource_type", "resource_id"]);
  pgm.createIndex("audit_logs", "created_at");
}

export async function down(pgm) {
  pgm.dropTable("audit_logs");
  pgm.dropTable("sessions");
  pgm.dropTable("role_permissions");
  pgm.dropTable("user_roles");
  pgm.dropTable("permissions");
  pgm.dropTable("roles");
  pgm.dropTable("users");
}
