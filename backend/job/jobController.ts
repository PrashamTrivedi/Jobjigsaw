import express, {Request, Response} from 'express'
import JobModel from './jobModel'
import Logger from "../utils/logger"
import {getDb} from "../database"
import {checkCompatiblity, inferCompanyDetails, inferJobDescription} from "../openai"
import {MainResumeModel} from "../mainResume/mainResumeModel"
import {ChatCompletion, ChatCompletionChunk} from "openai/resources"
import {Stream} from "openai/streaming"
import axios from "axios"
import puppeteer from "puppeteer"

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
            const isStream = req.headers['streaming'] === 'true'
            const {description, additionalFields} = req.body
            const useCostSavingMode = req.headers['x-cost-saving-mode'] ? true : false

            const inferredDescription = await inferJobDescription(description, additionalFields, !useCostSavingMode, isStream)
            if (!isStream) {
                return res.status(200).json({inferredDescription: JSON.parse(inferredDescription as string ?? "")})
            } else {
                const inferredDescriptionStream = inferredDescription as Stream<ChatCompletionChunk>
                for await (const chunk of inferredDescriptionStream) {
                    res.write(chunk.choices[0]?.delta.content || "")
                }
                res.end()
            }
        } catch (error) {
            Logger.error(error)
            res.status(500).json({error: error})
        }
    }

    /**
     * @swagger
     * /jobs/infer-url:
     *   post:
     *     tags:
     *     - Jobs
     *     summary: Infer job details from a URL
     *     parameters:
     *       - in: body
     *         name: url
     *         description: The URL to infer job details from.
     *         schema:
     *           type: object
     *           required:
     *             - url
     *           properties:
     *             url:
     *               type: string
     *     responses:
     *       200:
     *         description: Job details inferred successfully
     *       500:
     *         description: Server error
     */
    public inferJobFromUrl = async (req: Request, res: Response) => {
        const url = req.body.url
        try {
            const browser = await puppeteer.launch()
            const page = await browser.newPage()
            await page.goto(url)
            const response = await page.content()

            const isStream = req.headers['streaming'] === 'true'
            const useCostSavingMode = req.headers['x-cost-saving-mode'] ? true : false
            const inferredDescription = await inferJobDescription(response, [], !useCostSavingMode, isStream)
            if (!isStream) {
                return res.status(200).json({inferredDescription: JSON.parse(inferredDescription as string ?? "")})
            } else {
                const inferredDescriptionStream = inferredDescription as Stream<ChatCompletionChunk>
                for await (const chunk of inferredDescriptionStream) {
                    res.write(chunk.choices[0]?.delta.content || "")
                }
                res.end()
            }
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
            const isStream = req.headers['streaming'] === 'true'
            const {description} = req.body
            const mainResumeModel = new MainResumeModel()
            const mainResume = await mainResumeModel.getMainResume()
            const useCostSavingMode = req.headers['x-cost-saving-mode'] ? true : false
            const compatibilityMatrix = await checkCompatiblity(JSON.stringify(description), JSON.stringify(mainResume), !useCostSavingMode, isStream)
            if (!isStream) {

                return res.status(200).json({compatibilityMatrix: JSON.parse(compatibilityMatrix as string ?? "")})
            } else {
                const compatibilityMatrixStream = compatibilityMatrix as Stream<ChatCompletionChunk>
                for await (const chunk of compatibilityMatrixStream) {
                    res.write(chunk.choices[0]?.delta.content || "")
                }
                res.end()
            }
        } catch (error) {
            Logger.error(error)
            res.status(500).json({error: error})
        }
    }

    /**
     * @swagger
     * /jobs/research-company/{CompanyName}:
     *   get:
     *     tags:
     *     - Jobs
     *     summary: Research a company
     *     parameters:
     *     - in: path
     *       name: CompanyName
     *       schema:
     *         type: string
     *       required: true
     *       description: The name of the company to research
     *     responses:
     *       200:
     *         description: Successful operation
     *       400:
     *         description: Invalid CompanyName supplied
     *       404:
     *         description: Company not found
     */
    public researchCompany = async (req: Request, res: Response) => {
        try {
            const isStream = req.headers['streaming'] === 'true'
            const {companyName} = req.params
            const useCostSavingMode = req.headers['x-cost-saving-mode'] ? true : false
            const companyResearch = await inferCompanyDetails(companyName, isStream, !useCostSavingMode)

            if (!isStream) {
                return res.status(200).json({companyResearch: JSON.parse(companyResearch as string ?? "")})
            } else {
                const companyResearchStream = companyResearch as Stream<ChatCompletionChunk>
                for await (const chunk of companyResearchStream) {
                    res.write(chunk.choices[0]?.delta.content || "")
                }
                res.end()
            }
        } catch (error) {
            Logger.error(error)
            return res.status(500).json({error: error})
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
     *             technicalSkills:
     *              type: string
     *             softSkills:
     *              type: string
     *             inferredJob:
     *              type: string
     *             inferredJobMatch:
     *              type: string
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
            const {text, url, companyName, post, type, location, technicalSkills, softSkills, inferredJob, inferredJobMatch} = req.body
            console.log({inferredJob, inferredJobMatch})
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
            const jobId = await jobModel.addJob(text, url, companyName, post, type, location, Date.now().toString(), skillsStr, softSkillsStr, inferredJob, inferredJobMatch)
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