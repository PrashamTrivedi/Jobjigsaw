import express from 'express'
import {MainResumeController} from "./mainResumeController"


const mainResumeRouter = express.Router()

const mainResumeController = new MainResumeController()



mainResumeRouter.get('/getMainResume', mainResumeController.getMainResume)
mainResumeRouter.put('/updateSkills', mainResumeController.updateSkills)
mainResumeRouter.put('/addWorkExperience', mainResumeController.updateWorkExperience)
mainResumeRouter.put('/addProject', mainResumeController.updateProjects)


import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

mainResumeRouter.post('/uploadResume', upload.single('resume'), mainResumeController.uploadResume);

export default mainResumeRouter;
