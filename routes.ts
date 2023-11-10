import express from 'express'
import mainResumeRouter from "./mainResume/mainResumeRouter"
import jobRouter from "./job/jobRouter"
import resumeRouter from "./resume/resumeRouter"

const router = express.Router()

router.use('/mainResume', mainResumeRouter)
router.use('/jobs', jobRouter)
router.use('/resumes', resumeRouter)

export default router
