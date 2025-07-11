import {Database} from "../database"

export class ResumeModel {
    private db: Database

    constructor(env: Env) {
        this.db = new Database(env.DB)
    }

    async createResume(resume: any) {
        const {resumeName, resumeContent, dateCreated, dateUpdated} = resume
        const query = `INSERT INTO resumes (resumeName, resumeContent, dateCreated, dateUpdated) VALUES (?, ?, ?, ?)`
        return this.db.run(query, [resumeName, resumeContent, dateCreated, dateUpdated])
    }

    async getResumes() {
        const query = `SELECT * FROM resumes`
        return this.db.all(query)
    }

    async getResumeById(id: string) {
        const query = `SELECT * FROM resumes WHERE id = ?`
        return this.db.get(query, [id])
    }

    async updateResume(id: string, resume: any) {
        const {resumeName, resumeContent, dateCreated, dateUpdated} = resume
        const query = `UPDATE resumes SET resumeName = ?, resumeContent = ?, dateCreated = ?, dateUpdated = ? WHERE id = ?`
        return this.db.run(query, [resumeName, resumeContent, dateCreated, dateUpdated, id])
    }

    async deleteResume(id: string) {
        const query = `DELETE FROM resumes WHERE id = ?`
        return this.db.run(query, [id])
    }
}