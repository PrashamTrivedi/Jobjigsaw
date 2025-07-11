import { D1Database } from '@cloudflare/workers-types';

export class Database {
    private db: D1Database;

    constructor(d1: D1Database) {
        this.db = d1;
    }

    async prepare(query: string) {
        return this.db.prepare(query);
    }

    async run(query: string, params?: any[]) {
        return this.db.run(query, params);
    }

    async all(query: string, params?: any[]) {
        return this.db.all(query, params);
    }

    async get(query: string, params?: any[]) {
        return this.db.first(query, params);
    }
}