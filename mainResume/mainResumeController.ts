import {Request, Response} from "express"
import {MainResumeModel} from "./mainResumeModel"
import {readPdfText} from 'pdf-text-reader'
import Logger from "../utils/logger"
import {getDb} from "../database"
import {generateJsonFromResume} from "../openai"

export class MainResumeController {
    constructor() { }


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
 *   post:
 *     tags: 
 *       - Main Resume
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
            Logger.info('Got text')
            const resumeJson = await generateJsonFromResume(pdfText)
            Logger.info('Got parsed JSON from Openai')
            await mainResumeModel.setMainResume(pdfText, resumeJson)
            return res.json({message: "Main resume set"})
        } catch (e) {
            Logger.error(e)
            return res.status(500).json({message: "Something is wrong in saving data"})
        }

    }

    /**
 * @swagger
 * /mainResume/getMainResume:
 *   get:
 *     tags:
 *       - Main Resume
 *     summary: Get main resume json
 *     responses:
 *       200:
 *         description: Main resume json
 *       500:
 *         description: Internal server error
 */
    async getMainResumeJson(req: Request, res: Response) {
        try {
            const db = await getDb()
            const mainResumeModel = new MainResumeModel(db)
            const mainResume = await mainResumeModel.getMainResume()
            const jsonData = mainResume
            if (mainResume.resumeJson) {
                jsonData.resumeJson = JSON.parse(mainResume.resumeJson)
            }
            return res.json(jsonData)
        } catch (e) {
            return res.status(500).json({message: "Internal server error"})
        }
    }

}