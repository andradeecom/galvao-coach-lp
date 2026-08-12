# Galvão Coach LP

Landing page for Galvão Coach, a personal trainer offering individualized
diet and training plans. The page collects leads through a contact form,
stores them in Supabase, and notifies the team by email.

## Stack

- [Astro](https://astro.build) 7 (server output, deployed on Vercel)
- React (interactive islands, e.g. the contact form)
- Tailwind CSS 4 (utility classes only — no component library)
- Supabase (contact storage)
- Nodemailer (email notifications on new leads)
- Cloudflare Turnstile (bot protection on the contact form)
- Cypress (e2e tests)

## Requirements

- Node.js 24.x
- pnpm 11.x (pinned via `packageManager` in `package.json`; enable
  [Corepack](https://vercel.com/docs/deployments/configure-a-build#corepack)
  on Vercel so the platform respects this instead of guessing a version)

## Getting started

```bash
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:4321`.

## Environment variables

Create a `.env` file (not committed) with:

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SECRET_KEY` | Supabase service key, used server-side to store contacts |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Nodemailer credentials for lead notification emails |
| `TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key (client-side widget) |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key (server-side verification) |
| `GHL_WEBHOOK_URL` | Webhook URL forwarding leads to GoHighLevel |

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Astro dev server |
| `pnpm build` | Type-check (`astro check`) and build for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm format` | Format the codebase with Prettier |
| `pnpm cypress:web` | Open Cypress in interactive mode |
| `pnpm cypress:headless` | Run Cypress tests headlessly |

## Structure

```
src/
├── assets/       Images and icons
├── components/   atom / molecule / organism component tiers
├── config/       Static content and app configuration
├── layouts/      Page layout(s)
├── pages/        Routes, including pages/api/ server endpoints
│   └── api/
│       ├── save-contact.ts   Stores a lead in Supabase and emails the team
│       └── turnstile.ts      Verifies the Turnstile challenge response
└── styles/       Global Tailwind stylesheet
```
