# CMS API contract — proposed

Status: contract draft, not implemented. All routes below are examples for review.

Base path: `/api/v1`

## Conventions

- JSON request/response, UTF-8.
- Validate every request on the server; reject unknown fields where appropriate.
- Use stable IDs, pagination (`limit`, `cursor`), explicit sort allowlists and filters with bounds.
- Return consistent errors: `{ "error": { "code": "VALIDATION_ERROR", "message": "Request is invalid", "requestId": "..." } }`.
- Never include stack traces, SQL errors, secret values, password hashes, session tokens or internal lead notes in public errors.
- Authenticated mutations use CSRF protection when session cookies are used.
- All timestamps are ISO 8601 UTC.
- Public endpoints return only published, indexable content that is safe for public display.

## Public read endpoints

- `GET /public/pages/:slug`
- `GET /public/articles`
- `GET /public/articles/:slug`
- `GET /public/countries`
- `GET /public/countries/:slug`
- `GET /public/programmes?kind=STUDY|WORK&country=:slug`
- `GET /public/programmes/:slug`
- `GET /public/faqs?topic=:slug`

Only return a version explicitly marked published. Never return drafts, private reviewer comments, unpublished changes or internal source notes.

## Authentication

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/session`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

Use generic login/reset responses to reduce account enumeration. Login should be throttled. Password reset tokens must be high entropy, short-lived, single-use, stored hashed and invalidated after use. Sessions rotate after login and privilege changes.

## Admin content

- `GET /admin/content`
- `POST /admin/content`
- `GET /admin/content/:id`
- `PATCH /admin/content/:id`
- `POST /admin/content/:id/submit-review`
- `POST /admin/content/:id/approve`
- `POST /admin/content/:id/reject`
- `POST /admin/content/:id/publish`
- `POST /admin/content/:id/schedule`
- `POST /admin/content/:id/archive`
- `GET /admin/content/:id/versions`
- `POST /admin/content/:id/restore-version`

Do not expose a generic endpoint that allows clients to set arbitrary workflow status. Each transition has a dedicated permission and application rule. Log actor, source/target state, content version, reason and time.

## Leads (private)

- `POST /public/leads`: validate, rate-limit, apply approved consent/data policy, and return a non-sensitive receipt. Do not enable until privacy/legal requirements are approved.
- `GET /admin/leads`: requires `leads.read_all` or `leads.read_assigned`; assigned users see only their assigned records.
- `GET /admin/leads/:id`: apply the same ownership/permission rule.
- `PATCH /admin/leads/:id`: restrict editable fields and record the action.
- `POST /admin/leads/:id/assign`: requires `leads.assign`.
- `POST /admin/leads/:id/events`: requires `leads.update`; reject unnecessary sensitive data in notes.
- `POST /admin/leads/:id/export`: separate permission, explicit audit event, bounded export and privacy-safe format.

## Initial permission keys

- `users.read`, `users.manage`, `users.manage_roles`
- `content.read`, `content.create`, `content.edit_own`, `content.edit_any`
- `content.submit_review`, `content.review`, `content.publish`, `content.schedule`, `content.archive`
- `seo.manage_metadata`, `seo.manage_redirects`
- `media.read`, `media.upload`, `media.delete`
- `leads.read_assigned`, `leads.read_all`, `leads.update`, `leads.assign`, `leads.export`, `leads.delete`
- `audit.read`, `settings.manage`

## Acceptance criteria before implementation

- A public anonymous request cannot retrieve a draft, unpublished version or lead.
- An editor cannot approve/publish their own content unless an explicit policy is approved.
- A consultant cannot access leads assigned to another consultant.
- Every role/permission change, publish, lead assignment, export and deletion creates an audit event.
- Invalid workflow transitions are rejected consistently.
- Login and password reset resist brute force and account enumeration.
- All route authorization has integration tests; UI-only hiding is not accepted as security.
