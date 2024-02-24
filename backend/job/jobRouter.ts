import express from 'express'
import JobController from "./jobController"


const jobRouter = express.Router()
const jobController = new JobController()



jobRouter.post('/', jobController.addJob)
jobRouter.delete('/:id', jobController.removeJob)
jobRouter.get('/', jobController.getAllJobs)
jobRouter.get('/:id', jobController.getJob)
jobRouter.post('/infer', jobController.inferJobDescription)
jobRouter.post('/infer-url', jobController.inferJobFromUrl)
jobRouter.post('/infer-match', jobController.inferJobMatch)
jobRouter.get('/research-company/:companyName', jobController.researchCompany)

export default jobRouter
