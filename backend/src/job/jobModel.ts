import {Database} from "../database"

export class JobModel {
    private db: Database

    constructor(env: Env) {
        this.db = new Database(env.DB)
    }

    async createJob(job: any) {
        const {companyName, jobTitle, jobDescription, jobUrl, jobStatus, jobSource, jobType, jobLocation, jobSalary, jobContact, jobNotes, jobDateApplied, jobDateCreated, jobDateUpdated} = job
        const query = `INSERT INTO jobs (companyName, jobTitle, jobDescription, jobUrl, jobStatus, jobSource, jobType, jobLocation, jobSalary, jobContact, jobNotes, jobDateApplied, jobDateCreated, jobDateUpdated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        return this.db.run(query, [companyName, jobTitle, jobDescription, jobUrl, jobStatus, jobSource, jobType, jobLocation, jobSalary, jobContact, jobNotes, jobDateApplied, jobDateCreated, jobDateUpdated])
    }

    async getJobs() {
        const query = `SELECT * FROM jobs`
        return this.db.all(query)
    }

    async getJobById(id: string) {
        const query = `SELECT * FROM jobs WHERE id = ?`
        return this.db.get(query, [id])
    }

    async updateJob(id: string, job: any) {
        const {companyName, jobTitle, jobDescription, jobUrl, jobStatus, jobSource, jobType, jobLocation, jobSalary, jobContact, jobNotes, jobDateApplied, jobDateCreated, jobDateUpdated} = job
        const query = `UPDATE jobs SET companyName = ?, jobTitle = ?, jobDescription = ?, jobUrl = ?, jobStatus = ?, jobSource = ?, jobType = ?, jobLocation = ?, jobSalary = ?, jobContact = ?, jobNotes = ?, jobDateApplied = ?, jobDateCreated = ?, jobDateUpdated = ? WHERE id = ?`
        return this.db.run(query, [companyName, jobTitle, jobDescription, jobUrl, jobStatus, jobSource, jobType, jobLocation, jobSalary, jobContact, jobNotes, jobDateApplied, jobDateCreated, jobDateUpdated, id])
    }

    async deleteJob(id: string) {
        const query = `DELETE FROM jobs WHERE id = ?`
        return this.db.run(query, [id])
    }
}