import { KVNamespace } from '@cloudflare/workers-types';

export class CloudflareKv {
    private kv: KVNamespace;

    constructor(kv: KVNamespace) {
        this.kv = kv;
    }

    async put(key: string, value: string) {
        return this.kv.put(key, value);
    }

    async get(key: string) {
        return this.kv.get(key);
    }

    async delete(key: string) {
        return this.kv.delete(key);
    }
}