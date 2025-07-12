import { D1Database } from '@cloudflare/workers-types';
import { D1Result, D1Response } from './types';

export class Database {
    private db: D1Database;

    constructor(d1: D1Database) {
        this.db = d1;
    }

    async prepare(query: string) {
        return this.db.prepare(query);
    }

    async run(query: string, params?: (string | number | null)[]): Promise<D1Result> {
        return this.db.run(query, params);
    }

    async all<T = unknown>(query: string, params?: (string | number | null)[]): Promise<D1Response<T>> {
        return this.db.all(query, params);
    }

    async get<T = unknown>(query: string, params?: (string | number | null)[]): Promise<T | null> {
        return this.db.first(query, params);
    }
}