
import betterSqlite3 from "better-sqlite3"


export async function getDb(): Promise<betterSqlite3.Database> {
    const db = betterSqlite3('./database.db')

    // Create a table called JD if it doesn't exist, with following columns, text, url, companyName, post, type, location, date
    db.prepare('CREATE TABLE IF NOT EXISTS JD (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, url TEXT, companyName TEXT, post TEXT, type TEXT, location TEXT, skills TEXT, softSkills TEXT, date TEXT)').run()

    // Create a table called saved_resumes if it doesn't exist, with the specified columns
    // Also, add a new column for cover_letter in TEXT format
    db.prepare(`
        CREATE TABLE IF NOT EXISTS SAVED_RESUMES (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            job_id INTEGER,
            updated_resume TEXT,
            technical_skills TEXT,
            soft_skills TEXT,
            cover_letter TEXT, -- New column for cover letter
            created_on TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (job_id) REFERENCES JD(id)
        )
    `).run()


    return db
}

