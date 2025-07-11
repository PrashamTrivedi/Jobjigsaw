import {Database} from "../database"

export class MainResumeModel {
    private db: Database

    constructor(env: Env) {
        this.db = new Database(env.DB)
    }

    async setMainResume(resume: any) {
        const {resumeName, resumeContent, dateCreated, dateUpdated} = resume
        const existingResume = await this.db.get(`SELECT * FROM mainResumes WHERE id = 1`)
        if (existingResume) {
            const query = `UPDATE mainResumes SET resumeName = ?, resumeContent = ?, dateCreated = ?, dateUpdated = ? WHERE id = 1`
            return this.db.run(query, [resumeName, resumeContent, dateCreated, dateUpdated])
        } else {
            const query = `INSERT INTO mainResumes (id, resumeName, resumeContent, dateCreated, dateUpdated) VALUES (1, ?, ?, ?, ?)`
            return this.db.run(query, [resumeName, resumeContent, dateCreated, dateUpdated])
        }
    }

    async getMainResume() {
        const query = `SELECT * FROM mainResumes WHERE id = 1`
        return this.db.get(query)
    }

    async updateMainResume(resume: any) {
        const {resumeName, resumeContent, dateCreated, dateUpdated} = resume
        const query = `UPDATE mainResumes SET resumeName = ?, resumeContent = ?, dateCreated = ?, dateUpdated = ? WHERE id = 1`
        return this.db.run(query, [resumeName, resumeContent, dateCreated, dateUpdated])
    }

    async deleteMainResume(id: string) {
        const query = `DELETE FROM mainResumes WHERE id = ?`
        return this.db.run(query, [id])
    }
}