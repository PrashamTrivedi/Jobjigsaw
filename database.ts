import {Database, open} from 'sqlite'
import sqlite3 from 'sqlite3'

export async function getDb(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
    const db = await open({
        filename: './database.db',
        driver: sqlite3.cached.Database,
    })
    return db
}