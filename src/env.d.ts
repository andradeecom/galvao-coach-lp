/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_PUBLIC_KEY: string;
  readonly RECAPTCHA_SECRET_KEY: string;
  readonly VITE_RECAPTCHA_SITE_KEY: string;
  readonly SMTP_HOST: string;
  readonly SMTP_PORT: string;
  readonly SMTP_USER: string;
  readonly SMTP_PASS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
