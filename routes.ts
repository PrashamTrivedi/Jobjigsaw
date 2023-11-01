import express from 'express'
import mainResumeRouter from "./mainResume/mainResumeRouter"

const router = express.Router()

router.use('/mainResume', mainResumeRouter)

export default router
