import express, {Request, Response} from 'express'
import ResumeModel from './resumeModel'
import Logger from "../utils/logger"
import {getDb} from "../database"
import {mainResume} from "../mainResume"
import ResumeTemplate from "./resumeTemplate"

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
     *               type: string
     *             technicalSkills:
     *               type: string
     *             softSkills:
     *               type: string
     *     responses:
     *       200:
     *         description: Resume added successfully
     *       500:
     *         description: Server error
     */
    public addResume = async (req: Request, res: Response) => {
        try {
            const {jobId, updatedResume, technicalSkills, softSkills} = req.body
            const db = await getDb()
            const resumeModel = new ResumeModel(db)
            const resumeId = await resumeModel.createResume(jobId, updatedResume, technicalSkills, softSkills)
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
     *               type: string
     *             technicalSkills:
     *               type: string
     *             softSkills:
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
            const {updatedResume, technicalSkills, softSkills} = req.body
            // Logic to update the resume by ID
            // ...
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
