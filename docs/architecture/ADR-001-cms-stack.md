# ADR-001: CMS application architecture

- Status: Proposed
- Date: 2026-10-28
- Scope: DuHocHaNoi CMS foundation
- Depends on: public-site foundation PR #1

## Context

The repository currently contains a static public website. It has no package manifest, server, database, authentication, lead persistence, deployment configuration or automated backend tests. The contact form is intentionally a demo.

The CMS must support structured, frequently updated information about study-abroad and overseas-work programmes while protecting applicant/lead data and keeping SEO pages crawlable.

## Decision proposed

Use a modular Node.js + TypeScript backend and PostgreSQL, with a server-rendered/static-capable public frontend and a separate protected admin interface. Do not introduce a large framework or a monolith until the public route structure and deployment target are confirmed.

Recommended logical layers:

```text
Public pages / Admin UI
        |
        v
HTTP routes + request validation
        |
        v
Application services (authorization + business rules)
        |
        v
Repository interfaces
        |
        v
PostgreSQL repositories / transactions
```

### Proposed baseline

- Runtime: supported Node.js LTS, TypeScript.
- HTTP API: Express with explicit route modules and schema validation.
- Database: PostgreSQL; migrations committed and reviewed.
- SQL access: a typed query/repository layer or ORM selected in implementation ADR; no SQL in route handlers.
- Authentication: server-side sessions with secure, HttpOnly, SameSite cookies; CSRF protection for cookie-authenticated mutations.
- Passwords: Argon2id or a maintained password hashing implementation; never store plaintext or reversible passwords.
- Authorization: role-based access control (RBAC) enforced in services/server routes, not only hidden UI controls.
- Media: local object storage adapter for development, production object storage selected before upload implementation.
- Observability: structured logs with sensitive values redacted; audit events for privileged and lead-data actions.
- Testing: unit tests for transitions/permissions, integration tests with PostgreSQL, static checks and CI.
- Configuration: environment variables with startup validation; secrets excluded from source control.

## Authorization model

Initial roles:
- `ADMIN`: manage users, roles, configuration and all content.
- `SEO_MANAGER`: manage metadata, redirects, taxonomy, publishing and SEO review.
- `EDITOR`: create and edit assigned content; submit for review.
- `REVIEWER`: review and approve/reject content; cannot grant roles.
- `CONSULTANT`: access assigned leads and update lead follow-up status.
- `READ_ONLY`: read explicitly permitted CMS data.

Permissions must be named capabilities (for example `content.publish`, `leads.read_assigned`, `users.manage_roles`). Avoid authorization rules based only on role names inside UI code.

## Content lifecycle

Proposed states:
`DRAFT → IN_REVIEW → APPROVED → SCHEDULED → PUBLISHED → NEEDS_UPDATE → ARCHIVED`

Rules:
- Editors cannot approve or publish their own content by default.
- Only authorized reviewers can approve; publishing requires `content.publish`.
- Scheduling and publishing must record actor and timestamp.
- A published edit creates a new version and does not silently overwrite the last published snapshot.
- Rejected content returns to draft with a recorded reason.
- Every transition is validated by the application service and written to audit history.
- Direct status changes from a generic CRUD endpoint are forbidden.

## Security boundaries

- Public API responses must never expose admin users, sessions, internal notes, audit records or lead data.
- Lead endpoints require authentication, authorization, rate limiting and server-side validation.
- Do not log passwords, session IDs, access tokens, full identity documents or unnecessary personal data.
- Apply CSRF protection to cookie-authenticated writes; use secure cookie settings in production.
- Restrict CORS to known origins; do not use wildcard credentials.
- Validate upload MIME type, extension, file size and actual content; store uploads outside executable/public paths until approved.
- Add login throttling, session rotation after authentication/privilege changes, secure password reset and account recovery.
- Use parameterized database operations, least-privilege database credentials and tested backups.
- Do not enable production collection of lead data until the privacy notice, retention, access and deletion rules are approved.

## Consequences

Positive:
- Clear separation of public pages, editorial logic, data access and authorization.
- SEO content is structured and versioned.
- Lead data has a separate permission boundary.
- The app can add more content types without duplicating auth/audit rules.

Trade-offs:
- More initial structure than a static site.
- Database migrations, session security and editorial workflow need tests before production.
- SSR/SSG and final ORM choice depend on deployment/runtime and existing hosting constraints.

## Open decisions before implementation

1. Confirm the official domain and canonical host.
2. Confirm whether the public frontend should remain static/SSG or use SSR.
3. Confirm deployment target and whether PostgreSQL is reachable from that environment.
4. Select ORM/query layer in a follow-up ADR after dependency/runtime baseline is agreed.
5. Confirm legal entity, licences, contact data and actual privacy/retention requirements.
6. Confirm who will act as Editor, Reviewer, SEO Manager and Consultant.
