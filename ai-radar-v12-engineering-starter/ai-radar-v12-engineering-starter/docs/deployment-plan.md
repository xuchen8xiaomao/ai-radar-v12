# AI Radar V1.2 deployment and maintenance plan

## What gets deployed when?

| Change | Web (Pages) | API (Worker) | D1 migration | Scheduled collector |
| --- | --- | --- | --- | --- |
| Layout, styles, filters | Yes | No | No | No |
| API request/response business logic | Only if client changes | Yes | Usually no | Maybe |
| New column or table | Maybe | Usually | Yes (staging first) | Maybe |
| RSS source toggled through admin | No | No | No (write to DB via API) | No |
| New article or manual review | No | No | No | Automatic write |
| Collector parsing or scoring change | No | Maybe | Maybe | Yes |
| Critical shared feature | Often | Often | If schema changes | If collector changes |

## Separation
1. `ai-radar.pages.dev` remains current public V1 until launch decision.
2. V1.2 preview runs in a separate Cloudflare Pages project (`ai-radar-v12-preview` example; actual domain not reserved) and a separate preview Worker.
3. Staging D1 and production D1 are distinct. Never point preview at production writes.
4. Frontend calls a versioned `/api/v1` contract. Preserve API compatibility during staggered rollouts.

## Controlled deployment sequence
1. Agree on OpenAPI/JSON payloads and data migration plan.
2. Backup current article JSON and all relevant database content. Stage import of existing data.
3. Create preview D1 and Worker, apply migrations in staging, deploy API with read-only routes.
4. Deploy React site preview. Validate search, language, topics, scores, content provenance, and mobile.
5. Implement admin authentication **before** enabling any write APIs. Protect with service-side authorization; allow anonymous read only for published records.
6. Test review/merge, rollback/undo, audit trail, duplicate collector runs, and source toggles.
7. Backup production, deploy backward-compatible Worker, then release production frontend. Enable new collector only after safe API deployment.
8. Observe logs, errors, limits, and data volumes. If needed, rollback web/API separately; DB schema rollback requires a documented restore/migration path.

## Routine maintenance
- Every collection run: log source success/failures, dedupe counts, lag and write errors.
- Daily: check pipeline alerts and backup health; snapshots of popularity signals.
- Weekly: review uncertain merges and source health; audit data coverage.
- Monthly: test restoration of backup, review costs, migrations, dependency patches and source quality.

## Cost and authentication
Start on free tiers; monitor Worker requests, CPU, D1 reads/writes/storage, Pages builds and Actions minutes. Vendor limits may change. A `pages.dev` domain is free; independent paid domain unnecessary.

Authentication design is **not yet finalized**. Consider Cloudflare Access for a single-admin protected editor, but check that it fits public read + protected API and available plan allowances. Never use a frontend-only admin flag or token.

## First implementation milestones
- E1: React design-system + layout faithfully matching approved V1.2 HTML.
- E2: Source/articles read-only Worker API + staging D1 import and migration.
- E3: Admin auth, CRUD review, stable Event IDs, immutable audit log, event merge/undo.
- E4: Research Track, timeline, score histories, popularity estimator + transparency.
- E5: acceptance tests, security checks, backup/restore and production cutover.
