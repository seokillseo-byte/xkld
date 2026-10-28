# CMS implementation plan — DuHocHaNoi

Status: planned; no production backend exists yet.

## Phase A — decisions and repository baseline
- [x] Audit the repository and preserve the static public site as the current baseline.
- [x] Add static-site quality workflow; latest observed run for PR #1 succeeded.
- [x] Draft architecture, data model and API contract.
- [ ] Confirm canonical domain and hosting/deployment target.
- [ ] Confirm public rendering strategy (static/SSG or SSR).
- [ ] Confirm privacy, retention and legal information for lead capture.

## Phase B — backend bootstrap
- [ ] Add Node.js LTS + TypeScript project, lockfile and environment schema.
- [ ] Add health/readiness endpoints with safe output.
- [ ] Add structured logging with redaction and request IDs.
- [ ] Add test runner, lint/typecheck, CI and local development instructions.
- [ ] Add PostgreSQL connection management and reviewed migration tool.
- Acceptance: fresh checkout can install deterministically, run checks and start locally without production secrets.

## Phase C — identity, sessions and RBAC
- [ ] Users, roles, permissions and initial role/permission seed.
- [ ] Secure password hashing, login throttling and generic auth errors.
- [ ] Server-side sessions with secure cookie settings, CSRF and session rotation.
- [ ] Password reset with hashed single-use expiring tokens.
- [ ] Audit events for sign-in, role changes and sensitive actions.
- Acceptance: integration tests prove anonymous/unauthorized requests cannot access admin resources; privilege changes revoke/rotate sessions.

## Phase D — content management
- [ ] Content items, typed programme details, taxonomies and media metadata.
- [ ] Versioned content drafts with separate published snapshot.
- [ ] Workflow service and transition-specific endpoints.
- [ ] Review/publish/schedule/archive permissions and audit events.
- [ ] SEO fields, source attribution, last-verified date, redirects and canonical validation.
- Acceptance: editors cannot publish without permission; invalid transitions are rejected; public endpoints expose only published content.

## Phase E — admin UI
- [ ] Sign-in and session-aware protected routes.
- [ ] Content list/search/filter, editor, preview and version history.
- [ ] Review queue and publish/schedule actions.
- [ ] Role-aware navigation as a usability layer; API remains authoritative.
- Acceptance: keyboard/mobile basics, accessible labels, empty/error/loading states and tests.

## Phase F — leads and CRM
- [ ] Finalize consent, legal basis, retention, access/deletion and privacy notice.
- [ ] Add validated/rate-limited lead endpoint, bot protection and server-side validation.
- [ ] Add assignment, follow-up events, restricted access, export permissions and audit.
- [ ] Connect contact form only after privacy review and end-to-end tests.
- Acceptance: consultant sees only authorized leads; no lead data leaks to public endpoints/logs.

## Phase G — release readiness
- [ ] CI runs unit/integration tests against PostgreSQL, migrations, lint and typecheck.
- [ ] Security review: auth, CSRF, IDOR, injection, upload, rate limits and secrets.
- [ ] Backups/restore test, monitoring, HTTPS, security headers and environment separation.
- [ ] Accessibility, performance, SEO crawlability and broken-link checks.
- [ ] Replace all sample data and review legal content before deployment.

## Operating rules
- Do not merge or deploy without explicit approval.
- Keep changes in small Draft PRs until reviewed.
- Do not weaken tests to get green CI.
- Do not fabricate legal licences, programme availability, tuition/fees, salary, partners or outcome guarantees.
- Do not collect real leads before privacy/security gates pass.
