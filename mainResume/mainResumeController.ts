import {Request, Response} from "express"
import {MainResumeModel} from "./mainResumeModel"
import {readPdfText} from 'pdf-text-reader'
import Logger from "../utils/logger"
import {getDb} from "../database"
import {generateJsonFromResume} from "../openai"

export class MainResumeController {
    constructor() { }

    async getMainResume(req: Request, res: Response) {
        try {
            const db = await getDb()
            const mainResumeModel = new MainResumeModel(db)
            const mainResume = await mainResumeModel.getMainResume()
            return res.json(mainResume)
        } catch (e) {
            return res.status(500).json({message: "Internal server error"})
        }
    }

    async updateMainResume(req: Request, res: Response) {
        const mainResume = req.body.mainResume
        try {
            const db = await getDb()
            const mainResumeModel = new MainResumeModel(db)

            await mainResumeModel.updateMainResume(mainResume)
            return res.json({message: "Main resume updated"})
        } catch (e) {
            return res.status(500).json({message: "Internal server error"})
        }
    }

    /**
 * @swagger
 * /mainResume/setMainResume:
 *   tags: Main Resume
 *   description: Main Resume management
 *   post:
 *     summary: Uploads a resume file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: resume
 *         type: file
 *         description: The file to upload.
 *     responses:
 *       200:
 *         description: Main resume set
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Something is wrong in saving data or reading pdf
 */
    async setMainResume(req: Request, res: Response) {
        const resumeFile = req.file
        if (!resumeFile) {
            return res.status(400).json({message: "No file uploaded"})
        }

        const db = await getDb()
        const mainResumeModel = new MainResumeModel(db)


        try {
            const pdfText = await readPdfText({
                filePath: resumeFile.path,
            })
            const resumeJson = await generateJsonFromResume(pdfText)
            await mainResumeModel.setMainResume(pdfText,resumeJson)
            return res.json({message: "Main resume set"})
        } catch (e) {
            Logger.error(e)
            return res.status(500).json({message: "Something is wrong in saving data"})
        }

    }


}