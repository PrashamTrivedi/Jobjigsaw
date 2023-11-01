import express from 'express'
import {MainResumeController} from "./mainResumeController"
import {MainResumeModel} from "./mainResumeModel"

import multer from 'multer'
import {getDb} from "../database"
const upload = multer({dest: 'uploads/'})

const mainResumeRouter = express.Router()

const mainResumeController = new MainResumeController()


mainResumeRouter.post('/setMainResume', upload.single('resume'), (req, res, next) => mainResumeController.setMainResume(req, res, next))

export default mainResumeRouter
