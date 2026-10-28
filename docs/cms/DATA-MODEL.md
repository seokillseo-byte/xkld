# CMS data model — proposed

Status: design only. This file describes the target model; it is not a deployed database schema or proof of compliance.

## Design principles

1. Keep published public content separate from internal leads and admin data.
2. Use stable IDs, timestamps, explicit foreign keys, unique slugs and indexes for public lookup.
3. Version content; preserve the last published snapshot while a new draft is under review.
4. Store source attribution and last-verified metadata for high-impact claims such as fees, eligibility, visa/work rules and programme availability.
5. Record privileged changes and lead access/export/deletion in an append-only audit log.
6. Never store uploaded identity documents unless a documented business need, legal basis, retention period and secure storage design are approved.

## Core tables

### Identity and authorization

- `users`: id, email (normalized unique), password_hash, display_name, status, last_login_at, created_at, updated_at.
- `roles`: id, key (unique), name, description, system_role.
- `permissions`: id, key (unique), description.
- `user_roles`: user_id, role_id, granted_by, granted_at.
- `role_permissions`: role_id, permission_id.
- `sessions`: id, user_id, hashed_session_token, expires_at, created_at, last_seen_at, revoked_at, metadata with secrets excluded.
- `password_reset_tokens`: user_id, token_hash, expires_at, used_at, created_at. Store only a hash of a high-entropy token.

### Editorial content

- `content_items`: id, content_type, slug, locale, current_status, author_id, reviewer_id, published_version_id, scheduled_at, published_at, created_at, updated_at, deleted_at.
- `content_versions`: id, content_item_id, version_number, title, excerpt, body (structured JSON or sanitized rich text), seo_title, meta_description, canonical_override (nullable and validated), index_policy, source_notes, verified_at, created_by, created_at, change_summary. Unique (content_item_id, version_number).
- `content_review_events`: id, content_item_id, version_id, from_status, to_status, actor_id, reason, created_at.
- `countries`: content_item_id, country_code, display_name, official_source_urls.
- `program_details`: content_item_id, programme_kind (STUDY/WORK), country_content_id, provider_name, eligibility_summary, language_requirements, fee_summary, availability_status, source_url, last_verified_at. Fields must be expanded based on verified business needs; do not invent programme facts.
- `taxonomies`: id, taxonomy_type, slug, name, parent_id.
- `content_taxonomies`: content_item_id, taxonomy_id.
- `media_assets`: id, storage_key, original_filename, safe_mime_type, byte_size, alt_text, caption, uploaded_by, created_at, deleted_at.
- `redirects`: id, source_path (unique), destination_path, http_status (301/302), enabled, created_by, created_at.
- `content_sources`: id, content_version_id, source_url, source_title, publisher, accessed_at, verified_by, notes.

### Leads and audit

- `leads`: id, full_name, phone, email (nullable), interest_type, country_interest, message, consent_record, status, assigned_to, source_path, referrer, utm_source, utm_medium, utm_campaign, created_at, updated_at, deleted_at.
- `lead_events`: id, lead_id, actor_id, event_type, note, created_at. Keep notes access-controlled; do not store unnecessary sensitive information.
- `audit_logs`: id, actor_id, action, resource_type, resource_id, outcome, request_id, created_at, redacted_metadata. Append-only for normal application roles.

## Important constraints and indexes

- Unique normalized email for active users; unique (content_type, locale, slug) for non-deleted content.
- Unique (content_item_id, version_number).
- Index content by (current_status, published_at), content_versions by content_item_id, lead queues by (status, assigned_to, created_at), and audit_logs by (resource_type, resource_id, created_at).
- Foreign keys should use restrictive deletion for published content, audit logs and lead history. Prefer soft-delete for business records; purge according to a reviewed retention policy.
- Validate canonical URL and redirect destination to avoid open redirects and accidental cross-domain canonicalization.
- Add database constraints for enum-like values and positive media size; validate state transitions in application services.
- Use transactions for publishing, role changes, lead assignment and audit event writes.
- Do not allow public API access to drafts, internal notes, lead records, audit logs, or user/session tables.

## Questions that affect final migration

- Are multiple languages needed on day one?
- Do articles/programmes need independent types or a shared content item with typed detail tables?
- Should leads be retained in this database or pushed directly to an existing CRM?
- What retention and deletion periods apply to lead contact details?
- Is multi-site/multi-tenant support required, or is this a single-brand CMS initially?

These are design decisions; finalize them before writing production migrations.
