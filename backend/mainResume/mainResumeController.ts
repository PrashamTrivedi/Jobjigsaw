import {Request, Response} from "express"
import {MainResumeModel} from "./mainResumeModel"
import {generateJsonFromResume} from "../openai"
import fs from 'fs'
import pdf from 'pdf-parse'

export class MainResumeController {
    private mainResumeModel: MainResumeModel

    constructor() {
        this.mainResumeModel = new MainResumeModel()
    }

    /**
     * @swagger
     * /mainResume/getMainResume:
     *   get:
     *     tags:
     *      - Main Resume
     *     description: Get the main resume
     *     responses:
     *       200:
     *         description: Success
     */
    public getMainResume = async (req: Request, res: Response) => {
        const resume = await this.mainResumeModel.getMainResume()
        res.json(resume)
    }


    /**
     * @swagger
     * /mainResume/updateSkills:
     *   put:
     *     tags:
     *      - Main Resume
     *     description: Update the skills section of the main resume
     *     parameters:
     *       - in: body
     *         name: skills
     *         description: The new skills to update
     *         schema:
     *           type: array
     *           items:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               items:
     *                 type: array
     *                 items:
     *                   type: string
     *     responses:
     *       200:
     *         description: Success
     */
    public updateSkills = async (req: Request, res: Response) => {
        const skills = req.body
        this.mainResumeModel.updateSkills(skills)
        res.json({message: 'Skills updated successfully'})
    }

    /**
     * @swagger
     * /mainResume/addWorkExperience:
     *   put:
     *     tags:
     *      - Main Resume
     *     description: Update the work experience section of the main resume
     *     parameters:
     *       - in: body
     *         name: workExperience
     *         description: The new work experience to update
     *         schema:
     *           type: object
     *           properties:
     *             company:
     *               type: string
     *             role:
     *               type: string
     *             duration:
     *               type: string
     *             responsibilities:
     *               type: array
     *               items:
     *                 type: string
     *     responses:
     *       200:
     *         description: Success
     */
    public updateWorkExperience = async (req: Request, res: Response) => {
        const workExperience = req.body
        this.mainResumeModel.addWorkExperience(workExperience)
        return res.json({message: 'Work experience updated successfully'})
    }

    /**
     * @swagger
     * /mainResume/addProject:
     *   put:
     *     tags:
     *       - Main Resume
     *     description: Update the projects section of the main resume
     *     parameters:
     *       - in: body
     *         name: project
     *         description: The new project to update
     *         schema:
     *           type: object
     *           properties:
     *             name:
     *               type: string
     *             duration:
     *               type: string
     *             description:
     *               type: string
     *             techStack:
     *               type: array
     *               items:
     *                 type: string
     *             url:
     *               type: string
     *             responsibilities:
     *               type: array
     *               items:
     *                 type: string
     *     responses:
     *       200:
     *         description: Success
     */
    public updateProjects = async (req: Request, res: Response) => {
        const project = req.body
        // Assuming you have a method to update projects in your model
        this.mainResumeModel.addProject(project)
       return res.json({message: 'Projects updated successfully'})
    }



    /**
     * @swagger
     * /mainResume/uploadResume:
     *   post:
     *     tags:
     *       - Main Resume
     *     description: Upload a resume PDF and parse it to JSON
     *     consumes:
     *       - multipart/form-data
     *     parameters:
     *       - in: formData
     *         name: resume
     *         type: file
     *         description: The resume PDF to upload.
     *     responses:
     *       200:
     *         description: Resume parsed to JSON successfully.
     *       400:
     *         description: Error parsing resume.
     */
    public uploadResume = async (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).send('No file uploaded.')
        }

        try {
            const dataBuffer = fs.readFileSync(req.file.path)
            const data = await pdf(dataBuffer)
            const resumeText = data.text
            const useCostSavingMode = req.headers['x-cost-saving-mode'] ? true : false

            const resumeJson = await generateJsonFromResume(resumeText, !useCostSavingMode)
            console.log(resumeJson)
            // Write resumeJson to mainResume.json file
            fs.writeFileSync('mainResume_parsed.json', JSON.stringify(resumeJson))
            res.json(resumeJson)
        } catch (error) {
            res.status(400).send('Error parsing resume.')
        } finally {
            // Clean up uploaded file
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
        }
    }
}