# Backend foundation — DuHocHaNoi

Status: initial implementation on a Draft PR. Not production-ready.

## Included
- Node.js 22+, TypeScript strict mode, Express API bootstrap.
- Environment parsing with field-only validation errors.
- JSON request parsing limited to 32 KiB and X-Powered-By disabled.
- Request IDs and structured request logs that intentionally omit query strings, bodies, cookies and authorization headers.
- Liveness endpoint: GET /api/health.
- Readiness endpoint: GET /api/health/ready; it returns only a generic dependency status and does not disclose connection details.
- Optional PostgreSQL pool. Without DATABASE_URL, the API can start locally but readiness is 503; with configuration, readiness executes SELECT 1.
- HTTP tests, a PostgreSQL migration smoke test, and a GitHub Actions workflow using a disposable PostgreSQL 16 service.

## Local development
1. Install Node.js 22 or newer.
2. Copy .env.example to .env.
3. Run npm install.
4. Run npm run dev.
5. Set DATABASE_URL to a development PostgreSQL database.
6. Run npm run migrate:up to apply the initial identity schema.
7. Run npm run check to typecheck, test and build.

No real user, lead, credential or application data is stored by this phase. Do not connect the public contact form to this API yet.

## Deliberate non-goals
- No authentication, session cookies, RBAC, CSRF handling or admin routes.
- Initial identity schema migration exists; application repositories and authentication flows are not implemented.
- No lead capture or email sending.
- No production deployment, secrets or real business/legal information.
- package-lock.json is still pending. CI currently uses npm install; before treating installs as reproducible, generate and commit the lockfile, then switch CI to npm ci.

## Security notes for review
- When DATABASE_SSL=true, PostgreSQL TLS certificate verification remains enabled.
- Request log fields are intentionally allowlisted. Do not add request body, headers, query values, or database connection strings to logs.
- The generic error handler avoids returning internal error details to clients.
