import express, {Request, Response} from 'express'
import JobModel from './jobModel'
import Logger from "../utils/logger"
import {getDb} from "../database"
import {checkCompatiblity, inferJobDescription} from "../openai"
import {MainResumeModel} from "../mainResume/mainResumeModel"

class JobController {


    constructor() {

    }

    /**
 * @swagger
 * /jobs/infer:
 *   post:
 *     tags:
 *     - Jobs
 *     summary: Infer a job description
 *     parameters:
 *       - in: body
 *         name: job
 *         description: The job description to infer.
 *         schema:
 *           type: object
 *           required:
 *             - description
 *           properties:
 *             description:
 *               type: string
 *     responses:
 *       200:
 *         description: Job description inferred successfully
 *       500:
 *         description: Server error
 */
    public inferJobDescription = async (req: Request, res: Response) => {
        try {
            const {description, additionalFields} = req.body
            const inferredDescription = await inferJobDescription(description, additionalFields)
            res.status(200).json({inferredDescription: JSON.parse(inferredDescription ?? "")})
        } catch (error) {
            Logger.error(error)
            res.status(500).json({error: error})
        }
    }

    /**
* @swagger
* /jobs/infer-match:
*   post:
*     tags:
*     - Jobs
*     summary: Infer if job description matches the resume
*     parameters:
*       - in: body
*         name: job
*         description: The job description to infer.
*         schema:
*           type: object
*           properties:
 *             description:
 *               type: string
*     
*     responses:
*       200:
*         description: Job description inferred successfully
*       500:
*         description: Server error
*/
    public inferJobMatch = async (req: Request, res: Response) => {
        try {
            const {description, additionalFields} = req.body
            const mainResumeModel = new MainResumeModel()
            const mainResume = await mainResumeModel.getMainResume()
            const compatibilityMatrix = await checkCompatiblity(JSON.stringify(description), JSON.stringify(mainResume))
            res.status(200).json({compatibilityMatrix: JSON.parse(compatibilityMatrix ?? "")})
        } catch (error) {
            Logger.error(error)
            res.status(500).json({error: error})
        }
    }


    /**
     * @swagger
     * /jobs:
     *   post:
     *     tags:
     *     - Jobs   
     *     summary: Add a new job
     *     parameters:
     *       - in: body
     *         name: job
     *         description: The job to create.
     *         schema:
     *           type: object
     *           required:
     *             - text
     *             - url
     *             - companyName
     *             - post
     *             - type
     *             - location
     *             - date
     *           properties:
     *             text:
     *               type: string
     *             url:
     *               type: string
     *             companyName:
     *               type: string
     *             post:
     *               type: string
     *             type:
     *               type: string
     *             location:
     *               type: string
     *             date:
     *               type: string
     *     responses:
     *       200:
     *         description: Job added successfully
     *       500:
     *         description: Server error
     */
    public addJob = async (req: Request, res: Response) => {
        try {
            const db = await getDb()
            const jobModel = new JobModel(db)
            const {text, url, companyName, post, type, location, technicalSkills, softSkills} = req.body
            let skillsStr = ""
            if (Array.isArray(technicalSkills)) {
                skillsStr = technicalSkills.join(",")
            } else {
                skillsStr = JSON.stringify(technicalSkills)
            }

            let softSkillsStr = ""
            if (Array.isArray(softSkills)) {
                softSkillsStr = softSkills.join(",")
            } else {
                softSkillsStr = JSON.stringify(softSkills)
            }
            const jobId = await jobModel.addJob(text, url, companyName, post, type, location, Date.now().toString(), skillsStr, softSkillsStr)
            res.status(200).json({jobId})
        } catch (err) {
            Logger.error(err)
            res.status(500).json({error: err})
        }
    }

    /**
     * @swagger
     * /jobs/{id}:
     *   delete:
     *     tags:
     *      - Jobs
     *     summary: Remove a job
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Numeric ID of the job to remove.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Job removed successfully
     *       500:
     *         description: Server error
     */
    public removeJob = async (req: Request, res: Response) => {
        try {
            const db = await getDb()
            const jobModel = new JobModel(db)
            const {id} = req.params
            await jobModel.removeJob(Number(id))
            res.status(200).json({message: 'Job removed successfully'})
        } catch (error) {
            Logger.error(error)
            res.status(500).json({error: error})
        }
    }
    /**
     * @swagger
     * /jobs:
     *   get:
     *     tags:
     *      - Jobs
     *     summary: Retrieve a list of jobs
     *     responses:
     *       200:
     *         description: A list of jobs.
     *       500:
     *         description: Server error
     */
    public getAllJobs = async (req: Request, res: Response) => {
        try {
            const db = await getDb()
            const jobModel = new JobModel(db)
            const jobs = await jobModel.getAllJobs()
            res.status(200).json(jobs)
        } catch (error) {
            Logger.error(error)
            res.status(500).json({error: error})
        }
    }

    /**
     * @swagger
     * /jobs/{id}:
     *   get:
     *     tags:
     *      - Jobs
     *     summary: Retrieve a job by its id
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Numeric ID of the job to retrieve.
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: A job.
     *       404:
     *         description: Job not found
     *       500:
     *         description: Server error
     */
    public getJob = async (req: Request, res: Response) => {
        try {
            const db = await getDb()
            const jobModel = new JobModel(db)
            const {id} = req.params
            const job = await jobModel.getJob(Number(id))
            if (!job) {
                res.status(404).json({message: 'Job not found'})
            } else {
                res.status(200).json(job)
            }
        } catch (error) {
            Logger.error(error)
            res.status(500).json({error: error})
        }
    }
}

export default JobController