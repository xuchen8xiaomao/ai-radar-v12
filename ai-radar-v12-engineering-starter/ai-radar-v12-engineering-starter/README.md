# AI Radar V1.2 — engineering starter

**Current milestone: E1 — React homepage componentization (implementation started).**

This is an isolated V1.2 development workspace. It does not modify the existing V1 production website, GitHub repository, or Cloudflare deployment.

## Project layout
- `apps/web`: React + TypeScript + Vite homepage; interactive sample-data UI.
- `apps/api`: Cloudflare Worker read-only API scaffold; write routes remain disabled.
- `db/migrations`: draft D1 schema migrations; not applied to production.
- `docs/architecture-overview.md`: architecture, component and data-flow diagrams, with implementation status.
- `docs/stage-1-acceptance.md`: current milestone scope and acceptance checklist.
- `docs/deployment-plan.md`: independent frontend/backend/database release strategy.
- `reference/v12-home-prototype.html`: previously approved single-file visual prototype.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
cd apps/web
npm install
npm run dev
```

Build the frontend:

```bash
npm run build
npm run preview
```

The page currently uses clearly labelled demo data. It does not connect to production APIs or D1.

## Release policy
- Keep current V1 production unchanged until V1.2 acceptance.
- Develop and preview V1.2 in a separate Cloudflare project and separate staging database.
- Frontend-only changes deploy Pages; API changes deploy Worker; schema changes require a reviewed D1 migration.
- Do not deploy production migrations automatically on frontend pushes.
- Never commit API tokens, passwords, database credentials, or private unpublished notes.
- Implement authentication, server-side authorization, input validation and audit logs before enabling write APIs.

## Current validation note
The source and documentation have been updated, but dependency installation/build validation could not be completed in the current environment because npm package downloads timed out. Run `npm install` and `npm run build` locally before preview deployment.
