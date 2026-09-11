/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // add more VITE_ vars here as you add them to .env.example
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
