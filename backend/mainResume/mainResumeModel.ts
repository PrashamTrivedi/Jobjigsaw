
import {Project, Resume, Skills, WorkExperience, mainResume} from "../mainResume"

import fs from 'fs'
export class MainResumeModel {

    private mainResumeData: Resume = mainResume

    constructor() { }

    async getMainResume(): Promise<Resume> {
        this.mainResumeData = JSON.parse(fs.readFileSync('./mainResume.json').toString())

        return this.mainResumeData
    }

    async updateSkills(skills: Skills[]): Promise<void> {
        for (const skill of skills) {
            const index = this.mainResumeData.skills.findIndex((p) => p.name === skill.name)
            const items = skill.items.filter((item) => item !== '')
            skill.items = items
            if (index === -1) {
                this.mainResumeData.skills.push(skill)
            } else if (skill.items.length > 0) {
                this.mainResumeData.skills[index].items = skill.items
            } else {
                this.mainResumeData.skills.splice(index, 1)
            }
        }
        // Write main resume to ../mainResume.json
        fs.writeFileSync('./mainResume.json', JSON.stringify(this.mainResumeData, null, 4))

    }

    async addWorkExperience(workExperience: WorkExperience): Promise<void> {
        const index = this.mainResumeData.workExperience.findIndex((p) => p.company === workExperience.company)
        if (index !== -1) {
            this.mainResumeData.workExperience[index] = workExperience
        } else {
            this.mainResumeData.workExperience.push(workExperience)
        }
        // Write main resume to ../mainResume.json
        fs.writeFileSync('./mainResume.json', JSON.stringify(this.mainResumeData, null, 4))
    }

    async addProject(project: Project): Promise<void> {
        const index = this.mainResumeData.projects.findIndex((p) => p.name === project.name)
        if (index !== -1) {
            if (project.description === 'DELETE') {
                this.mainResumeData.projects.splice(index, 1)
            } else {
                this.mainResumeData.projects[index] = project
            }
        } else {

            if (project.description !== 'DELETE') {
                this.mainResumeData.projects.push(project)
            }
        }
        // Write main resume to ../mainResume.json
        fs.writeFileSync('./mainResume.json', JSON.stringify(this.mainResumeData, null, 4))
    }

    async addCertification(certification: string): Promise<void> {
        this.mainResumeData.certifications.push(certification)
        // Write main resume to ../mainResume.json
        fs.writeFileSync('./mainResume.json', JSON.stringify(this.mainResumeData, null, 4))
    }

}