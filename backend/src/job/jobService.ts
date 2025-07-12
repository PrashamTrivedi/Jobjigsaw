import { JobModel } from "./jobModel";
import { Env, Job, D1Result } from "../types";

export class JobService {
    private jobModel: JobModel;

    constructor(env: Env) {
        this.jobModel = new JobModel(env);
    }

    async createJob(job: Omit<Job, 'id'>): Promise<D1Result> {
        return this.jobModel.createJob(job);
    }

    async getJobs(): Promise<Job[]> {
        return this.jobModel.getJobs();
    }

    async getJobById(id: string): Promise<Job | null> {
        return this.jobModel.getJobById(id);
    }

    async updateJob(id: string, job: Partial<Job>): Promise<D1Result> {
        return this.jobModel.updateJob(id, job);
    }

    async deleteJob(id: string): Promise<D1Result> {
        return this.jobModel.deleteJob(id);
    }
}