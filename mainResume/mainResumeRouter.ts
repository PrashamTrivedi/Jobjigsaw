import express from 'express'
import {MainResumeController} from "./mainResumeController"


const mainResumeRouter = express.Router()

const mainResumeController = new MainResumeController()



mainResumeRouter.get('/getMainResume', mainResumeController.getMainResume)
mainResumeRouter.put('/updateSkills', mainResumeController.updateSkills)
mainResumeRouter.put('/addWorkExperience', mainResumeController.updateWorkExperience)
mainResumeRouter.put('/addProject', mainResumeController.updateProjects)


export default mainResumeRouter
