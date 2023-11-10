import express, {Request, Response} from 'express'
import ResumeModel from './resumeModel'
import Logger from "../utils/logger"
import {getDb} from "../database"

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
            const db = await getDb();
            const resumeModel = new ResumeModel(db);
            const resumes = await resumeModel.getAllResumes();
            res.status(200).json(resumes);
        } catch (error) {
            Logger.error(error);
            res.status(500).json({error: 'Server error'});
        }
    }
}

export default ResumeController
