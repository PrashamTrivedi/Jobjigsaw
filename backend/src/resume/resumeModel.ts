import { Database } from "../database";
import { Env, Resume, D1Result } from "../types";

export class ResumeModel {
    private db: Database

    constructor(env: Env) {
        this.db = new Database(env.DB)
    }

    async createResume(resume: Omit<Resume, 'id'>): Promise<D1Result> {
        const {resumeName, resumeContent, dateCreated, dateUpdated} = resume
        const query = `INSERT INTO resumes (resumeName, resumeContent, dateCreated, dateUpdated) VALUES (?, ?, ?, ?)`
        return this.db.run(query, [resumeName, resumeContent, dateCreated, dateUpdated])
    }

    async getResumes(): Promise<Resume[]> {
        const query = `SELECT * FROM resumes`
        const response = await this.db.all<Resume>(query)
        return response.results
    }

    async getResumeById(id: string): Promise<Resume | null> {
        const query = `SELECT * FROM resumes WHERE id = ?`
        return this.db.get<Resume>(query, [id])
    }

    async updateResume(id: string, resume: Partial<Resume>): Promise<D1Result> {
        const {resumeName, resumeContent, dateCreated, dateUpdated} = resume
        const query = `UPDATE resumes SET resumeName = ?, resumeContent = ?, dateCreated = ?, dateUpdated = ? WHERE id = ?`
        return this.db.run(query, [resumeName, resumeContent, dateCreated, dateUpdated, id])
    }

    async deleteResume(id: string): Promise<D1Result> {
        const query = `DELETE FROM resumes WHERE id = ?`
        return this.db.run(query, [id])
    }
}