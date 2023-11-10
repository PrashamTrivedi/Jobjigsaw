import betterSqlite3 from "better-sqlite3"

interface Resume {
    id: number
    job_id: number
    updated_resume: string
    technical_skills: string
    soft_skills: string
    created_on: string
}

export default class ResumeModel {
    private readonly db: betterSqlite3.Database

    constructor(db: betterSqlite3.Database) {
        this.db = db
    }

    async createResume(jobId: number, updatedResume: string, technicalSkills: string, softSkills: string): Promise<number | bigint> {
        const insert = this.db.prepare(`
            INSERT INTO saved_resumes (job_id, updated_resume, technical_skills, soft_skills)
            VALUES (?, ?, ?, ?)
        `).run(jobId, updatedResume, technicalSkills, softSkills)
        return insert.lastInsertRowid
    }

    async getResume(id: number): Promise<Resume> {
        return this.db.prepare(`
            SELECT * FROM saved_resumes WHERE id = ?
        `).get(id) as Resume
    }

    async deleteResume(id: number): Promise<void> {
        this.db.prepare(`
            DELETE FROM saved_resumes WHERE id = ?
        `).run(id)
    }
    async getAllResumes(): Promise<Resume[]> {
        return this.db.prepare(`
            SELECT * FROM saved_resumes
        `).all() as Resume[]
    }

}
