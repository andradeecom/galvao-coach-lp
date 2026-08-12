/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly SMTP_HOST: string;
  readonly SMTP_PORT: string;
  readonly SMTP_USER: string;
  readonly SMTP_PASS: string;
  readonly TURNSTILE_SITE_KEY: string;
  readonly TURNSTILE_SECRET_KEY: string;
  readonly GHL_API_TOKEN: string;
  readonly GHL_LOCATION_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
