import {Request, Response} from "express"
import {MainResumeModel} from "./mainResumeModel"

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
        res.json({message: 'Work experience updated successfully'})
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
        res.json({message: 'Projects updated successfully'})
    }


}