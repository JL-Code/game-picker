/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 应用 API 基础路径 */
  readonly NUXT_PUBLIC_API_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
