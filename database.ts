
import betterSqlite3 from "better-sqlite3"


export async function getDb(): Promise<betterSqlite3.Database> {
    const db = betterSqlite3('./database.db')

    // Create a table called JD if it doesn't exist, with following columns, text, url, companyName, post, type, location, date
    db.prepare('CREATE TABLE IF NOT EXISTS JD (text TEXT, url TEXT, companyName TEXT, post TEXT, type TEXT, location TEXT, date TEXT)').run()

    return db
}

