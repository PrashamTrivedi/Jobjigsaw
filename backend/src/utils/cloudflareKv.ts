import { KVNamespace } from '@cloudflare/workers-types';

export class CloudflareKv {
    private kv: KVNamespace;

    constructor(kv: KVNamespace) {
        this.kv = kv;
    }

    async put(key: string, value: string, options?: {expirationTtl?: number}) {
        return this.kv.put(key, value, options);
    }

    async get(key: string) {
        return this.kv.get(key);
    }

    async list(prefix?: string) {
        const res = await this.kv.list({prefix});
        return res.keys.map((k) => k.name);
    }

    async delete(key: string) {
        return this.kv.delete(key);
    }
}