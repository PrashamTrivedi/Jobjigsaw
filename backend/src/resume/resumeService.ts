import {ResumeModel} from "./resumeModel"

export class ResumeService {
    private resumeModel: ResumeModel

    constructor(env: Env) {
        this.resumeModel = new ResumeModel(env)
    }

    async createResume(resume: any) {
        return this.resumeModel.createResume(resume)
    }

    async getResumes() {
        return this.resumeModel.getResumes()
    }

    async getResumeById(id: string) {
        return this.resumeModel.getResumeById(id)
    }

    async deleteResume(id: string) {
        return this.resumeModel.deleteResume(id)
    }

    async updateResume(id: string, resume: any) {
        return this.resumeModel.updateResume(id, resume)
    }
}