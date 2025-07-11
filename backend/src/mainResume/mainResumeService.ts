import {MainResumeModel} from "./mainResumeModel"

export class MainResumeService {
    private mainResumeModel: MainResumeModel

    constructor(env: Env) {
        this.mainResumeModel = new MainResumeModel(env)
    }

    async setMainResume(resume: any) {
        return this.mainResumeModel.setMainResume(resume)
    }

    async getMainResume() {
        return this.mainResumeModel.getMainResume()
    }

    async updateMainResume(resume: any) {
        return this.mainResumeModel.updateMainResume(resume)
    }
}