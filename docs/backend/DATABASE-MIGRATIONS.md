# PostgreSQL migrations

The API schema is managed with node-pg-migrate. Migration files are reviewed and committed under `migrations/`.

## Commands

- Apply pending migrations: `npm run migrate:up`
- Run unit and integration tests: `npm test`
- Run all checks: `npm run check`

Set `DATABASE_URL` to a PostgreSQL database dedicated to development or testing before running migrations. Never point migration commands at production without a reviewed rollout and backup plan.

## Initial schema

Migration `001_initial_identity.js` creates foundational tables for users, roles, permissions, role assignments, role-permission mappings, server-side sessions and audit events. It establishes foreign keys, unique constraints and basic indexes. It does not seed an initial administrator or implement login/session issuance.

## Migration policy

- Add forward-only schema changes as new migration files; do not rewrite migrations already applied to shared databases.
- Use a new reversible migration for corrective changes where possible.
- Keep credentials and applicant/lead data out of migration files and logs.
- Run migrations before the integration test suite in CI.
- Authentication and authorization logic must be implemented and reviewed separately from these tables.
