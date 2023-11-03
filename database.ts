import {Database, open} from 'sqlite'
import sqlite3 from 'sqlite3'

export async function getDb(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
    const db = await open({
        filename: './database.db',
        driver: sqlite3.cached.Database,
    })

    // Create a table called JD if it doesn't exist, with following columns, text, url, companyName, post, type, location, date
    await db.run('CREATE TABLE IF NOT EXISTS JD (text TEXT, url TEXT, companyName TEXT, post TEXT, type TEXT, location TEXT, date TEXT)')


    return db
}