/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LLM_URL: string; // your environment variable
  // add other env vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
