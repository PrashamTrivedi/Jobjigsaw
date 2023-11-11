import betterSqlite3 from "better-sqlite3"

interface Resume {
    id: number
    job_id: number
    updated_resume: string
    technical_skills: string
    soft_skills: string
    cover_letter: string // New field for cover letter
    created_on: string
}

export default class ResumeModel {
    private readonly db: betterSqlite3.Database

    constructor(db: betterSqlite3.Database) {
        this.db = db
    }

    async createResume(jobId: number, updatedResume: string, technicalSkills: string, softSkills: string, coverLetter: string): Promise<number | bigint> {
        const insert = this.db.prepare(`
            INSERT INTO saved_resumes (job_id, updated_resume, technical_skills, soft_skills, cover_letter)
            VALUES (?, ?, ?, ?, ?)
        `).run(jobId, updatedResume, technicalSkills, softSkills,coverLetter)
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

    async updateResume(id: number, updatedResume: string, technicalSkills: string, softSkills: string, coverLetter: string, about?: string, workExperience?: string, projects?: string): Promise<void> {
        const updateQuery = this.db.prepare(`
            UPDATE saved_resumes
            SET updated_resume = ?,
                technical_skills = ?,
                soft_skills = ?,
                cover_letter = ?
                ${about ? ', about = ?' : ''}
                ${workExperience ? ', work_experience = ?' : ''}
                ${projects ? ', projects = ?' : ''}
            WHERE id = ?
        `)
        const updateParams = [
            updatedResume,
            technicalSkills,
            softSkills,
            coverLetter,
            ...(about ? [about] : []),
            ...(workExperience ? [workExperience] : []),
            ...(projects ? [projects] : []),
            id
        ]
        updateQuery.run(...updateParams)
    }
}
