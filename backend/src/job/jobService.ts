import { JobModel } from "./jobModel";

export class JobService {
    private jobModel: JobModel;

    constructor(env: Env) {
        this.jobModel = new JobModel(env);
    }

    async createJob(job: any) {
        return this.jobModel.createJob(job);
    }

    async getJobs() {
        return this.jobModel.getJobs();
    }

    async getJobById(id: string) {
        return this.jobModel.getJobById(id);
    }

    async updateJob(id: string, job: any) {
        return this.jobModel.updateJob(id, job);
    }

    async deleteJob(id: string) {
        return this.jobModel.deleteJob(id);
    }
}