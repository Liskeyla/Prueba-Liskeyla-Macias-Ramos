/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POWERBI_EMBED_URL: string;
  readonly VITE_POWERBI_REPORT_ID: string;
  readonly VITE_POWERBI_EMBED_TOKEN: string;
  readonly VITE_POWERBI_WORKSPACE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
