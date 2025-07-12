import { Database } from "../database";
import { Env, Job, D1Result, D1Response } from "../types";

export class JobModel {
    private db: Database

    constructor(env: Env) {
        this.db = new Database(env.DB)
    }

    async createJob(job: Omit<Job, 'id'>): Promise<D1Result> {
        const {companyName, jobTitle, jobDescription, jobUrl, jobStatus, jobSource, jobType, jobLocation, jobSalary, jobContact, jobNotes, jobDateApplied, jobDateCreated, jobDateUpdated} = job
        const query = `INSERT INTO jobs (companyName, jobTitle, jobDescription, jobUrl, jobStatus, jobSource, jobType, jobLocation, jobSalary, jobContact, jobNotes, jobDateApplied, jobDateCreated, jobDateUpdated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        return this.db.run(query, [companyName, jobTitle, jobDescription, jobUrl, jobStatus, jobSource, jobType, jobLocation, jobSalary, jobContact, jobNotes, jobDateApplied, jobDateCreated, jobDateUpdated])
    }

    async getJobs(): Promise<Job[]> {
        const query = `SELECT * FROM jobs`
        const response = await this.db.all<Job>(query)
        return response.results
    }

    async getJobById(id: string): Promise<Job | null> {
        const query = `SELECT * FROM jobs WHERE id = ?`
        return this.db.get<Job>(query, [id])
    }

    async updateJob(id: string, job: Partial<Job>): Promise<D1Result> {
        const {companyName, jobTitle, jobDescription, jobUrl, jobStatus, jobSource, jobType, jobLocation, jobSalary, jobContact, jobNotes, jobDateApplied, jobDateCreated, jobDateUpdated} = job
        const query = `UPDATE jobs SET companyName = ?, jobTitle = ?, jobDescription = ?, jobUrl = ?, jobStatus = ?, jobSource = ?, jobType = ?, jobLocation = ?, jobSalary = ?, jobContact = ?, jobNotes = ?, jobDateApplied = ?, jobDateCreated = ?, jobDateUpdated = ? WHERE id = ?`
        return this.db.run(query, [companyName, jobTitle, jobDescription, jobUrl, jobStatus, jobSource, jobType, jobLocation, jobSalary, jobContact, jobNotes, jobDateApplied, jobDateCreated, jobDateUpdated, id])
    }

    async deleteJob(id: string): Promise<D1Result> {
        const query = `DELETE FROM jobs WHERE id = ?`
        return this.db.run(query, [id])
    }
}