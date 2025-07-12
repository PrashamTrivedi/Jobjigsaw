import { MainResumeModel } from "./mainResumeModel";
import { Env, MainResume, D1Result } from "../types";

export class MainResumeService {
    private mainResumeModel: MainResumeModel

    constructor(env: Env) {
        this.mainResumeModel = new MainResumeModel(env)
    }

    async setMainResume(resume: Omit<MainResume, 'id'>): Promise<D1Result> {
        return this.mainResumeModel.setMainResume(resume)
    }

    async getMainResume(): Promise<MainResume | null> {
        return this.mainResumeModel.getMainResume()
    }

    async updateMainResume(resume: Partial<MainResume>): Promise<D1Result> {
        return this.mainResumeModel.updateMainResume(resume)
    }
}