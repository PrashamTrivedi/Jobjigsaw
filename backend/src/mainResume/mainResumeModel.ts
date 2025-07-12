import { Database } from "../database";
import { Env, MainResume, D1Result } from "../types";

export class MainResumeModel {
    private db: Database

    constructor(env: Env) {
        this.db = new Database(env.DB)
    }

    async setMainResume(resume: Omit<MainResume, 'id'>): Promise<D1Result> {
        const {resumeName, resumeContent, dateCreated, dateUpdated} = resume
        const existingResume = await this.db.get<MainResume>(`SELECT * FROM mainResumes WHERE id = 1`)
        if (existingResume) {
            const query = `UPDATE mainResumes SET resumeName = ?, resumeContent = ?, dateCreated = ?, dateUpdated = ? WHERE id = 1`
            return this.db.run(query, [resumeName, resumeContent, dateCreated, dateUpdated])
        } else {
            const query = `INSERT INTO mainResumes (id, resumeName, resumeContent, dateCreated, dateUpdated) VALUES (1, ?, ?, ?, ?)`
            return this.db.run(query, [resumeName, resumeContent, dateCreated, dateUpdated])
        }
    }

    async getMainResume(): Promise<MainResume | null> {
        const query = `SELECT * FROM mainResumes WHERE id = 1`
        return this.db.get<MainResume>(query)
    }

    async updateMainResume(resume: Partial<MainResume>): Promise<D1Result> {
        const {resumeName, resumeContent, dateCreated, dateUpdated} = resume
        const query = `UPDATE mainResumes SET resumeName = ?, resumeContent = ?, dateCreated = ?, dateUpdated = ? WHERE id = 1`
        return this.db.run(query, [resumeName, resumeContent, dateCreated, dateUpdated])
    }

    async deleteMainResume(id: string): Promise<D1Result> {
        const query = `DELETE FROM mainResumes WHERE id = ?`
        return this.db.run(query, [id])
    }
}