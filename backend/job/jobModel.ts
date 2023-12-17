import betterSqlite3 from "better-sqlite3"
import {inferJobDescription} from "../openai"
interface Job {
    id: number
    text: string
    url: string
    companyName: string
    post: string
    type: string
    location: string
    date: string
    inferJobDescription: string
    inferJobMatch: string
    skills: string
    softSkills: string
}
export default class JobModel {
    private readonly db: betterSqlite3.Database

    constructor(db: betterSqlite3.Database) {
        this.db = db
    }

    async addJob(text: string, url: string, companyName: string, post: string, type: string, location: string, date: string, skills: string, softSkills: string, inferredJob: string, inferredJobMatch: string): Promise<number | bigint> {
        const insert = this.db.prepare('INSERT INTO JD (text, url, companyName, post, type, skills, softSkills, location, date) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)').run(text, url, companyName, post, type, skills, softSkills, location, date)
        return insert.lastInsertRowid
    }

    async getAllJobs(): Promise<Job[]> {
        return this.db.prepare('SELECT * FROM JD').all() as Job[]
    }

    async getJob(id: number): Promise<Job> {
        return this.db.prepare('SELECT * FROM JD WHERE id = ?').get(id) as Job
    }

    async removeJob(id: number): Promise<void> {
        this.db.prepare('DELETE FROM JD WHERE id = ?').run(id)
    }
}