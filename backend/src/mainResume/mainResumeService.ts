import {MainResumeModel} from "./mainResumeModel"
import {MainResume, D1Result} from "../types"
import {generateJsonFromResume} from "../openai"

export class MainResumeService {
    private mainResumeModel: MainResumeModel
    private env: Env

    constructor(env: Env) {
        this.mainResumeModel = new MainResumeModel(env)
        this.env = env
    }

    async setMainResume(resume: Omit<MainResume, 'id'>): Promise<D1Result> {
        return this.mainResumeModel.setMainResume(resume)
    }

    async getMainResume(): Promise<MainResume | null> {
        return this.mainResumeModel.getMainResume()
    }

    async updateMainResume(resume: Partial<MainResume> | {fileBuffer: ArrayBuffer, fileType: string}): Promise<any> {
        // Handle file upload case
        if ('fileBuffer' in resume && 'fileType' in resume) {
            const {fileBuffer, fileType} = resume

            // Generate unique filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
            const fileExtension = fileType === 'application/pdf' ? 'pdf' : 'json'
            const fileName = `main-resume-${timestamp}.${fileExtension}`

            // Save file to R2 bucket
            await this.env.RESUME_BUCKET.put(fileName, fileBuffer, {
                httpMetadata: {
                    contentType: fileType,
                }
            })

            // Parse resume content with AI
            let resumeText: string
            if (fileType === 'application/pdf') {
                // For PDF files, we'll need to extract text - for now using buffer as text
                // In production, you'd want to use a PDF parsing library
                resumeText = new TextDecoder().decode(fileBuffer)
            } else {
                // For JSON files
                resumeText = new TextDecoder().decode(fileBuffer)
            }

            const parsedResumeJson = await generateJsonFromResume(resumeText, this.env)

            if (!parsedResumeJson) {
                throw new Error('Failed to parse resume content')
            }

            // Update database with parsed content and file reference
            const now = new Date().toISOString()
            const resumeData: Partial<MainResume> = {
                resumeName: fileName,
                resumeContent: parsedResumeJson,
                dateCreated: now,
                dateUpdated: now
            }

            await this.mainResumeModel.updateMainResume(resumeData)

            return {
                success: true,
                fileName,
                parsedContent: parsedResumeJson,
                message: 'Resume uploaded and parsed successfully'
            }
        }

        // Handle regular resume data update case
        return this.mainResumeModel.updateMainResume(resume as Partial<MainResume>)
    }

    async getResumeFile(fileName: string): Promise<ReadableStream | null> {
        const object = await this.env.RESUME_BUCKET.get(fileName)
        return object?.body || null
    }

    async deleteResumeFile(fileName: string): Promise<boolean> {
        try {
            await this.env.RESUME_BUCKET.delete(fileName)
            return true
        } catch (error) {
            console.error('Error deleting file from R2:', error)
            return false
        }
    }
}