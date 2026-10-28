# Backend foundation — DuHocHaNoi

Status: initial implementation on a Draft PR. Not production-ready.

## Included
- Node.js 22+, TypeScript strict mode, Express API bootstrap.
- Environment parsing with field-only validation errors.
- JSON request parsing limited to 32 KiB and X-Powered-By disabled.
- Request IDs and structured request logs that intentionally omit query strings, bodies, cookies and authorization headers.
- Liveness endpoint: GET /api/health.
- Readiness endpoint: GET /api/health/ready; it returns only a generic dependency status and does not disclose connection details.
- Optional PostgreSQL pool. Without DATABASE_URL, the API can start locally but readiness is 503.
- HTTP tests and a GitHub Actions quality workflow.

## Local development
1. Install Node.js 22 or newer.
2. Copy .env.example to .env.
3. Run npm install.
4. Run npm run dev.
5. Run npm run check to typecheck, test and build.
6. Configure a local PostgreSQL DATABASE_URL to make readiness pass.

No real user, lead, credential or application data is stored by this phase. Do not connect the public contact form to this API yet.

## Deliberate non-goals
- No authentication, session cookies, RBAC, CSRF handling or admin routes.
- No schema migrations or data repositories yet.
- No lead capture or email sending.
- No production deployment, secrets or real business/legal information.
- Dependency lockfile should be generated and committed after the first successful npm dependency resolution in CI; use npm ci after that gate is added.

## Security notes for review
- When DATABASE_SSL=true, PostgreSQL TLS certificate verification remains enabled.
- Request log fields are intentionally allowlisted. Do not add request body, headers, query values, or database connection strings to logs.
- The generic error handler avoids returning internal error details to clients.
