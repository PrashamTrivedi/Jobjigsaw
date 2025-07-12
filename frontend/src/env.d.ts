/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_API_HOST: string
    readonly VITE_COST_SAVING_MODE: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}