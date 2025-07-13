import {D1Result, D1Response} from './types'

export class Database {
    private db: D1Database

    constructor(d1: D1Database) {
        this.db = d1
    }

    async prepare(query: string) {
        return this.db.prepare(query)
    }

    async run(query: string, params?: (string | number | null)[]): Promise<D1Result | null> {
        return this.db.prepare(query).bind(params).run()
    }

    async all<T = unknown>(query: string, params?: (string | number | null)[]): Promise<D1Response<T> | null> {
        return this.db.prepare(query).bind(params).all()
    }

    async get<T = unknown>(query: string, params?: (string | number | null)[]): Promise<T | null> {
        const preparedStatement = this.db.prepare(query)
        if (params) {
            preparedStatement.bind(params)
        }
        return preparedStatement.first()
    }
}