import { ResumeModel } from "./resumeModel";
import { Env, Resume, D1Result } from "../types";

export class ResumeService {
    private resumeModel: ResumeModel

    constructor(env: Env) {
        this.resumeModel = new ResumeModel(env)
    }

    async createResume(resume: Omit<Resume, 'id'>): Promise<D1Result> {
        return this.resumeModel.createResume(resume)
    }

    async getResumes(): Promise<Resume[]> {
        return this.resumeModel.getResumes()
    }

    async getResumeById(id: string): Promise<Resume | null> {
        return this.resumeModel.getResumeById(id)
    }

    async deleteResume(id: string): Promise<D1Result> {
        return this.resumeModel.deleteResume(id)
    }

    async updateResume(id: string, resume: Partial<Resume>): Promise<D1Result> {
        return this.resumeModel.updateResume(id, resume)
    }
}