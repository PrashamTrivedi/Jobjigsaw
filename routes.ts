import express from 'express'
import mainResumeRouter from "./mainResume/mainResumeRouter"
import jobRouter from "./job/jobRouter"

const router = express.Router()

router.use('/mainResume', mainResumeRouter)
router.use('/jobs', jobRouter)

export default router
