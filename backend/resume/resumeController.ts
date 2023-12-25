import express, {Request, Response} from 'express'
import ResumeModel from './resumeModel'
import Logger from "../utils/logger"
import {getDb} from "../database"
import {mainResume} from "../mainResume"
import ResumeTemplate from "./resumeTemplate"
import {generateResume} from "../openai"
import puppeteer from "puppeteer"
import {Stream} from "openai/streaming"
import {ChatCompletionChunk} from "openai/resources"
import jsPDF from "jspdf"

class ResumeController {
    constructor() {
        // Constructor content if needed
    }

    /**
     * @swagger
     * /resumes:
     *   post:
     *     tags:
     *     - Resumes
     *     summary: Add a new resume
     *     parameters:
     *       - in: body
     *         name: resume
     *         description: The resume to create.
     *         schema:
     *           type: object
     *           required:
     *             - jobId
     *             - updatedResume
     *             - technicalSkills
     *             - softSkills
     *           properties:
     *             jobId:
     *               type: number
     *             updatedResume:
     *               type: object
     *               description: The updated resume data as a JSON object.
     *             technicalSkills:
     *               type: string
     *             softSkills:
     *               type: string
     *             coverLetter:
     *               type: string
     *     responses:
     *       200:
     *         description: Resume added successfully
     *       500:
     *         description: Server error
     */
    public addResume = async (req: Request, res: Response) => {
        try {
            const {jobId, updatedResume: updatedResumeObj, technicalSkills, softSkills, coverLetter} = req.body
            const updatedResume = JSON.stringify(updatedResumeObj) // Convert the updatedResume object to a string
            const db = await getDb()
            const resumeModel = new ResumeModel(db)
            const resumeId = await resumeModel.createResume(jobId, updatedResume, technicalSkills, softSkills, coverLetter)
            res.status(200).json({resumeId})
        } catch (error) {
            Logger.error(error)
            res.status(500).json({error: 'Server error'})
        }
    }

    /**
     * @swagger
     * /resumes/{id}:
     *   get:
     *     tags:
     *     - Resumes
     *     summary: Retrieve a resume by its id
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Numeric ID of the resume to retrieve.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: A resume.
     *       404:
     *         description: Resume not found
     *       500:
     *         description: Server error
     */
    public getResume = async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            const db = await getDb()
            const resumeModel = new ResumeModel(db)
            const resume = await resumeModel.getResume(Number(id))
            if (!resume) {
                res.status(404).json({message: 'Resume not found'})
            } else {
                res.status(200).json(resume)
            }
        } catch (error) {
            Logger.error(error)
            res.status(500).json({error: 'Server error'})
        }
    }

    /**
     * @swagger
     * /resumes/{id}:
     *   delete:
     *     tags:
     *     - Resumes
     *     summary: Remove a resume
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Numeric ID of the resume to remove.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Resume removed successfully
     *       500:
     *         description: Server error
     */
    public removeResume = async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            const db = await getDb()
            const resumeModel = new ResumeModel(db)
            await resumeModel.deleteResume(Number(id))
            res.status(200).json({message: 'Resume removed successfully'})
        } catch (error) {
            Logger.error(error)
            res.status(500).json({error: 'Server error'})
        }
    }
    // ... existing methods ...

    /**
     * @swagger
     * /resumes/generate:
     *   post:
     *     tags:
     *     - Resumes
     *     summary: Generate a resume based on job compatibility data and cover letter requirement
     *     parameters:
     *       - in: body
     *         name: resumeData
     *         description: The data to generate the resume from.
     *         schema:
     *           type: object
     *           required:
     *             - jobCompatibilityData
     *             - generateCoverLetter
     *           properties:
     *             jobCompatibilityData:
     *               type: object
     *               description: Job compatibility data as a JSON object
     *             generateCoverLetter:
     *               type: boolean
     *               description: Flag to indicate if a cover letter should be generated
     *     responses:
     *       200:
     *         description: Generated resume data
     *       400:
     *         description: Bad request if the input data is invalid
     *       500:
     *         description: Server error
     */
    public generateResume = async (req: Request, res: Response) => {
        try {

            const isStream = req.headers['streaming'] === 'true'
            const {jobCompatibilityData, generateCoverLetter} = req.body
            const jobCompatibilityDataString = JSON.stringify(jobCompatibilityData)
            if (typeof generateCoverLetter !== 'boolean') {
                return res.status(400).json({error: 'Invalid input data'})
            }
            const modifiedResume = {
                skills: mainResume.skills,
                workExperience: mainResume.workExperience,
                projects: mainResume.projects,
            }
            const generatedResume = await generateResume(JSON.stringify(modifiedResume), jobCompatibilityDataString, generateCoverLetter, isStream)
            if (!isStream) {
                const resumeJson = JSON.parse(generatedResume as string ?? "")
                const resumeToReturn = {
                    generatedResume: {
                        ...mainResume,
                        projects: resumeJson.projects,
                        skills: resumeJson.skills,
                        workExperience: resumeJson.workExperience,
                    },
                    coverLetter: resumeJson.coverLetter
                }
                res.status(200).json({resumeDetails: resumeToReturn})
            } else {
                const generatedResumeStream = generatedResume as Stream<ChatCompletionChunk>
                for await (const chunk of generatedResumeStream) {
                    res.write(chunk.choices[0]?.delta.content || "")
                }
                res.end()
            }
        } catch (error) {
            Logger.error(error)
            res.status(500).json({error: 'Server error'})
        }
    }



    /**
     * @swagger
     * /resumes/html/{id}:
     *   get:
     *     tags:
     *     - Resumes
     *     summary: Get the complete HTML resume by its id
     *     parameters:
     *       - in: path
     *         name: id
     *         required: false
     *         description: Numeric ID of the resume to retrieve the HTML for (Leave blank for default resume).
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: The complete HTML resume.
     *       404:
     *         description: Resume not found
     *       500:
     *         description: Server error
     */
    public getCompleteResumeHtml = async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            let resumeData = mainResume
            if (id && id !== 'undefined') {
                const db = await getDb()
                const resumeModel = new ResumeModel(db)
                const savedResume = await resumeModel.getResume(Number(id))
                if (savedResume) {
                    resumeData = JSON.parse(savedResume.updated_resume)
                }
            }
            if (!resumeData) {
                resumeData = mainResume // Use the main resume if id is not provided or not found
            }
            const resumeTemplate = new ResumeTemplate(resumeData)
            const html = resumeTemplate.renderCompleteResume()

            res.status(200).send(html)
        } catch (error) {
            Logger.error(error)
            res.status(500).json({error: 'Server error'})
        }
    }

    /**
     * @swagger
     *
     * /resumes/printResume:
     *   post:
     *     tags:
     *       - Resumes
     *     description: Print a resume
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: body
     *         description: JobId or ResumeJson
     *         in: body
     *         required: true
     *         schema:
     *           type: object
     *           properties:
     *             jobId:
     *               type: number
     *             resumeJson:
     *               type: object
     *     responses:
     *       200:
     *         description: Resume printed successfully
     *       500:
     *         description: Server error
     */
    async printResume(req: Request, res: Response) {
        try {
            let resumeData
            const {jobId, resumeJson, resumeName} = req.body

            if (jobId) {
                const db = await getDb()
                const resumeModel = new ResumeModel(db)
                const savedResume = await resumeModel.getResume(Number(jobId))
                if (savedResume) {
                    resumeData = JSON.parse(savedResume.updated_resume)
                }
            } else if (resumeJson) {
                resumeData = resumeJson
            }

            if (!resumeData) {
                return res.status(400).json({error: 'Invalid input'})
            }

            const resumeTemplate = new ResumeTemplate(resumeData)
            const html = resumeTemplate.renderCompleteResume()
            const browser = await puppeteer.launch({headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'], })
            const page = await browser.newPage()
            await page.setViewport({width: 1240, height: 1754})
            await page.setContent(html, {waitUntil: 'networkidle0'})
            await page.evaluate(() => document.fonts.ready);
            await page.waitForTimeout(5000) // wait for 5 seconds
            const pdfBuffer = await page.pdf({
                printBackground: true,
                format: 'A4',
            })
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf')
            res.send(pdfBuffer)

        } catch (error) {
            Logger.error(error)
            res.status(500).json({error: 'Server error'})
        }
    }

    /**
     * @swagger
     * /resumes/{id}:
     *   put:
     *     tags:
     *     - Resumes
     *     summary: Update an existing resume
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Numeric ID of the resume to update.
     *         schema:
     *           type: integer
     *       - in: body
     *         name: resume
     *         description: Resume data to update.
     *         schema:
     *           type: object
     *           properties:
     *             updatedResume:
     *               type: object
     *               description: The updated resume data as a JSON object.
     *             technicalSkills:
     *               type: string
     *             softSkills:
     *               type: string
     *             coverLetter:
     *               type: string
     *     responses:
     *       200:
     *         description: Resume updated successfully
     *       400:
     *         description: Invalid input
     *       404:
     *         description: Resume not found
     *       500:
     *         description: Server error
     */
    public updateResume = async (req: Request, res: Response) => {
        try {
            const {id} = req.params
            const {updatedResume: updatedResumeObj, technicalSkills, softSkills, coverLetter} = req.body
            const updatedResume = JSON.stringify(updatedResumeObj) // Convert the updatedResume object to a string
            const db = await getDb()
            const resumeModel = new ResumeModel(db)
            await resumeModel.updateResume(Number(id), updatedResume, technicalSkills, softSkills, coverLetter)
            res.status(200).json({message: 'Resume updated successfully'})
        } catch (error) {
            Logger.error(error)
            res.status(500).json({error: 'Server error'})
        }
    }

    /**
     * @swagger
     * /resumes:
     *   get:
     *     tags:
     *     - Resumes
     *     summary: Retrieve a list of all resumes
     *     responses:
     *       200:
     *         description: A list of resumes.
     *       500:
     *         description: Server error
     */
    public getAllResumes = async (req: Request, res: Response) => {
        try {
            const db = await getDb()
            const resumeModel = new ResumeModel(db)
            const resumes = await resumeModel.getAllResumes()
            res.status(200).json(resumes)
        } catch (error) {
            Logger.error(error)
            res.status(500).json({error: 'Server error'})
        }
    }
}

export default ResumeController
