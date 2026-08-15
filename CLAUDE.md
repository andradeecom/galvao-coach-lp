# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                  # dev server on :4321
pnpm build                # astro check (typecheck) + astro build
pnpm format               # prettier --write
pnpm cypress:web          # open Cypress interactively
pnpm cypress:headless     # run Cypress headlessly (electron)
```

`pnpm build` runs `astro check` first, so a type error fails the build. To
typecheck without building, run `pnpm exec astro check`.

There is one e2e spec (`cypress/e2e/form.cy.ts`). To run a single spec:
`pnpm exec cypress run --spec cypress/e2e/form.cy.ts`. Cypress needs
`VITE_BASE_URL` set (used as `baseUrl`) and has `testIsolation: false` —
specs intentionally share state across `it` blocks.

`pnpm preview` is in package.json but does not work: the Vercel adapter
builds serverless functions rather than a previewable server. Verify
production behaviour with `pnpm build` plus `pnpm dev`, not `preview`.

## Environment

Node 24.x and pnpm 11.x (pinned via `packageManager`). Vercel ignores
`packageManager` unless Corepack is enabled for the project — without it
Vercel guesses a pnpm version from project creation date and fails to read
the lockfile. `pnpm-workspace.yaml` here holds `allowBuilds` /
`minimumReleaseAgeExclude` (pnpm 10+ keys) and deliberately has no
`packages:` field; older pnpm rejects it.

Server-only vars (`GHL_API_TOKEN`, `GHL_LOCATION_ID`, `SMTP_*`,
`TURNSTILE_SECRET_KEY`) are read via `import.meta.env` in API routes.
`TURNSTILE_SITE_KEY` is read in `index.astro` and passed to the client
through `define:vars`.

`src/env.d.ts` was rewritten alongside the GHL migration and now matches
what the code reads.

## Architecture

Astro 7 with `output: "server"` on the Vercel adapter. Images use
`passthroughImageService()`. Components follow atom / molecule / organism
tiers under `src/components`, with the `@/*` alias mapped to `src/*`.

### Lead capture flow

This spans several files and is the core of the app:

1. `ContactForm.tsx` (React island) validates with react-hook-form + zod,
   and pulls `utm_*` params off `window.location.search` into hidden fields.
2. On submit it reads a Turnstile token from the global `window.turnstile`,
   POSTs it to `/api/turnstile` for server-side verification, and only then
   POSTs the form to `/api/save-contact`.
3. `api/save-contact.ts` upserts the lead into GoHighLevel via
   `src/lib/ghl.ts`, then emails the coach via nodemailer. GHL is the system
   of record, so it is called **first** — if it fails the route returns 500
   and no email goes out. Either step failing returns 500; success redirects
   to `/thank-you`.

`src/lib/ghl.ts` POSTs to `https://services.leadconnectorhq.com/contacts/upsert`
with `Authorization: Bearer $GHL_API_TOKEN` and the required `Version:
2021-07-28` header (the API rejects requests without it). Upsert — not
create — so a repeat submission updates the existing contact instead of
erroring on a duplicate; GHL matches on email/phone per the location's
"Allow Duplicate Contact" setting. The form's single `name` field is split
on the first space into `firstName` / `lastName`. UTMs go through as
`customFields` keyed by `utm_*`, and **empty UTMs are omitted** so a later
direct visit cannot blank out attribution captured on an earlier submission.
Those `utm_*` custom fields must exist in the GHL location or they are
silently dropped.

On failure the form shows a toast pointing the visitor at
bernardo@galvaocoach.com, held for 10s rather than the 3s default so the
address stays readable.

Supabase was removed entirely (dependency, `src/types/database.types.ts`,
and env vars) — do not reintroduce it as a lead store. The older
`GHL_WEBHOOK_URL` forwarding step was also dropped in favour of the
authenticated API.

Turnstile coupling worth knowing: `index.astro` renders **two**
`<ContactForm client:load />` islands (hero and footer CTA) but only **one**
`#turnstile-widget` div, rendered explicitly via `onloadTurnstileCallback`.
Both islands share that single widget through the global `window.turnstile`,
addressing it by the `#turnstile-widget` selector.

### Styling

Tailwind 4 via the `@tailwindcss/vite` plugin (not `@astrojs/tailwind`,
which has no v7-compatible release). Configuration is CSS-first in
`src/styles/global.css` — there is no `tailwind.config.mjs`. That file is
imported by `src/layouts/Layout.astro`; Tailwind 4 does not auto-inject it.

daisyUI was removed. Its component classes were reimplemented as plain
utilities, so `input`, `btn`, `checkbox`, `carousel`, `label-text`,
`link-hover`, `rounded-box` etc. no longer resolve — do not reintroduce
them. Brand colors are `@theme` tokens (`--color-bgteam-*`) exposed as
`bg-bgteam-primary-500` and similar; semantic aliases (`--color-accent`,
`--color-primary`, …) exist so markup like `text-accent` keeps working.

The markup sets no `data-theme` attribute, so theme tokens must be defined
unconditionally rather than under a `[data-theme=...]` selector.

`Carousel.astro` is a native CSS scroll-snap strip (no JS), with a
scroll-driven reveal animation using `view-timeline-name` in a scoped
`<style>` block. Astro inlines that scoped CSS into the HTML rather than the
external stylesheet, so grepping the built `.css` for it will come up empty.

## Git

Do not commit or push without asking for explicit permission first. Staging
and showing a diff is fine; creating the commit is not.
