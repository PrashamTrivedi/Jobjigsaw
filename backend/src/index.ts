import {Hono} from 'hono'
import {cors} from 'hono/cors'
import {logger} from 'hono/logger'
import {secureHeaders} from 'hono/secure-headers'

import {Database} from './database'
import {CloudflareKv} from './utils/cloudflareKv'
import {JobService} from './job/jobService'
import {MainResumeService} from './mainResume/mainResumeService'
import {ResumeService} from './resume/resumeService'
import {generateJsonFromResume, inferJobDescription, checkCompatiblity, generateResume, inferCompanyDetails, inferJobDescriptionFromUrl} from './openai'

const app = new Hono<{Bindings: Env}>()

// Middleware
app.use('*', logger())
app.use('*', cors())
app.use('*', secureHeaders())

// Job Routes
app.post('/job', async (c) => {
	try {
		const jobService = new JobService(c.env)
		const {id, jobTitle, company, jobDescription, jobUrl, jobLocation, jobType, salary, postedDate, applicationDeadline, contactEmail, contactPhone, responsibilities, requirements, benefits, aboutCompany, howToApply, jobFitScore, jobFitBreakdown, inferredData} = await c.req.json()
		const result = await jobService.createJob({
			id, jobTitle, company, jobDescription, jobUrl, jobLocation, jobType, salary,
			postedDate, applicationDeadline, contactEmail, contactPhone, responsibilities,
			requirements, benefits, aboutCompany, howToApply, jobFitScore, jobFitBreakdown, inferredData
		}
		)
		return c.json({jobId: id, success: result.success})
	} catch (err: any) {
		console.error("Error adding job:", err)
		return c.json({error: err.message}, 500)
	}
})

app.delete('/job/:id', async (c) => {
	try {
		const jobService = new JobService(c.env)
		const {id} = c.req.param()
		const result = await jobService.deleteJob(id)
		if (result.changes && result.changes > 0) {
			return c.json({message: 'Job removed successfully'})
		} else {
			return c.json({message: 'Job not found or no changes made'}, 404)
		}
	} catch (error: any) {
		console.error("Error removing job:", error)
		return c.json({error: error.message}, 500)
	}
})

app.get('/job', async (c) => {
	try {
		const jobService = new JobService(c.env)
		const jobs = await jobService.getJobs()
		return c.json(jobs)
	} catch (error: any) {
		console.error("Error getting all jobs:", error)
		return c.json({error: error.message}, 500)
	}
})

app.get('/job/:id', async (c) => {
	try {
		const jobService = new JobService(c.env)
		const {id} = c.req.param()
		const job = await jobService.getJobById(id)
		if (!job) {
			return c.json({message: 'Job not found'}, 404)
		} else {
			return c.json(job)
		}
	} catch (error: any) {
		console.error("Error getting job:", error)
		return c.json({error: error.message}, 500)
	}
})

app.post('/job/infer', async (c) => {
	try {

		const {description, additionalFields} = await c.req.json()

		const inferredDescription = await inferJobDescription(description, additionalFields, c.env)

		return c.json({inferredDescription: inferredDescription})
	} catch (error: any) {
		console.error("Error inferring job description:", error)
		return c.json({error: error.message}, 500)
	}
})

app.post('/job/infer-url', async (c) => {
	try {
		const {url} = await c.req.json()
		const isStream = c.req.header('streaming') === 'true'

		const inferredDescription = await inferJobDescriptionFromUrl(url, c.env)
		return c.json({inferredDescription: inferredDescription})
	} catch (error: any) {
		console.error("Error inferring job from URL:", error)
		return c.json({error: error.message}, 500)
	}
})

app.post('/job/infer-match', async (c) => {
	try {
		const jobService = new JobService(c.env)

		const mainResumeService = new MainResumeService(c.env)
		const {description} = await c.req.json()
		const isStream = c.req.header('streaming') === 'true'
		const mainResume = await mainResumeService.getMainResume()

		if (!mainResume) {
			return c.json({error: "Main resume not found. Please upload your main resume first."}, 404)
		}

		const compatibilityMatrix = await checkCompatiblity(description, JSON.stringify(mainResume), c.env)

		return c.json({compatibilityMatrix: compatibilityMatrix})
	} catch (error: any) {
		console.error("Error inferring job match:", error)
		return c.json({error: error.message}, 500)
	}
})

app.get('/job/research-company/:companyName', async (c) => {
	try {
		const {companyName} = c.req.param()
		const isStream = c.req.header('streaming') === 'true'

		// This functionality will be moved to a dedicated service or removed if not directly supported by AI Gateway
		// For now, returning a placeholder
		return c.json({companyResearch: `Research for ${companyName} is not yet implemented via AI Gateway.`})

	} catch (error: any) {
		console.error("Error researching company:", error)
		return c.json({error: error.message}, 500)
	}
})

app.post('/job/analyze', async (c) => {
	try {
		const jobService = new JobService(c.env)
		const mainResumeService = new MainResumeService(c.env)
		const {jobUrl} = await c.req.json()
		const mainResume = await mainResumeService.getMainResume()

		if (!mainResume) {
			return c.json({error: "Main resume not found. Please upload your main resume first."}, 404)
		}

		const analyzedData = await inferJobDescriptionFromUrl(jobUrl, c.env)
		return c.json(analyzedData)
	} catch (error: any) {
		console.error("Error analyzing job:", error)
		return c.json({error: error.message}, 500)
	}
})


// Main Resume Routes
app.get('/main-resume', async (c) => {
	try {
		const mainResumeService = new MainResumeService(c.env)
		const resume = await mainResumeService.getMainResume()
		if (resume) {
			return c.json(resume)
		} else {
			return c.json({message: "Main resume not found"}, 404)
		}
	} catch (error: any) {
		console.error("Error getting main resume:", error)
		return c.json({error: error.message}, 500)
	}
})

app.post('/main-resume', async (c) => {
	try {
		const mainResumeService = new MainResumeService(c.env)
		const formData = await c.req.formData()
		const file = formData.get('resume') as File

		if (!file) {
			return c.json({error: 'No file uploaded.'}, 400)
		}

		const fileBuffer = await file.arrayBuffer()
		const fileType = file.type

		const parsedResume = await mainResumeService.updateMainResume({fileBuffer, fileType})
		return c.json(parsedResume)
	} catch (error: any) {
		console.error("Error uploading or parsing resume:", error)
		return c.json({error: error.message}, 400)
	}
})

app.put('/main-resume', async (c) => {
	try {
		const mainResumeService = new MainResumeService(c.env)
		const resume = await c.req.json()
		await mainResumeService.updateMainResume(resume)
		return c.json({message: 'Main resume updated successfully'})
	} catch (error: any) {
		console.error("Error updating main resume:", error)
		return c.json({error: error.message}, 500)
	}
})

// Resume Routes
app.post('/resume', async (c) => {
	try {
		const resumeService = new ResumeService(c.env)
		const {jobId, updatedResume, technicalSkills, softSkills, coverLetter} = await c.req.json()
		const result = await resumeService.createResume({
			jobId,
			updateResume: JSON.stringify(updatedResume), technicalSkills, softSkills, coverLetter
		})
		return c.json({resumeId: result.meta.last_row_id, success: result.success})
	} catch (error: any) {
		console.error("Error adding resume:", error)
		return c.json({error: error.message}, 500)
	}
})

app.get('/resume', async (c) => {
	try {
		const resumeService = new ResumeService(c.env)
		const resumes = await resumeService.getResumes()
		return c.json(resumes)
	} catch (error: any) {
		console.error("Error getting all resumes:", error)
		return c.json({error: error.message}, 500)
	}
})

app.get('/resume/:id', async (c) => {
	try {
		const resumeService = new ResumeService(c.env)
		const {id} = c.req.param()
		const resume = await resumeService.getResumeById(id)
		if (!resume) {
			return c.json({message: 'Resume not found'}, 404)
		} else {
			return c.json(resume)
		}
	} catch (error: any) {
		console.error("Error getting resume:", error)
		return c.json({error: error.message}, 500)
	}
})

app.delete('/resume/:id', async (c) => {
	try {
		const resumeService = new ResumeService(c.env)
		const {id} = c.req.param()
		const result = await resumeService.deleteResume(id)
		if (result.changes && result.changes > 0) {
			return c.json({message: 'Resume removed successfully'})
		} else {
			return c.json({message: 'Resume not found or no changes made'}, 404)
		}
	} catch (error: any) {
		console.error("Error removing resume:", error)
		return c.json({error: error.message}, 500)
	}
})

app.put('/resume/:id', async (c) => {
	try {
		const resumeService = new ResumeService(c.env)
		const {id} = c.req.param()
		const {updatedResume, technicalSkills, softSkills, coverLetter} = await c.req.json()
		const result = await resumeService.updateResume(
			id, {updatedResume: JSON.stringify(updatedResume), technicalSkills, softSkills, coverLetter})
		if (result.changes && result.changes > 0) {
			return c.json({message: 'Resume updated successfully'})
		} else {
			return c.json({message: 'Resume not found or no changes made'}, 404)
		}
	} catch (error: any) {
		console.error("Error updating resume:", error)
		return c.json({error: error.message}, 500)
	}
})

app.post('/resume/generate', async (c) => {
	try {
		const resumeService = new ResumeService(c.env)
		const mainResumeService = new MainResumeService(c.env)
		const {jobCompatibilityData, generateCoverLetter} = await c.req.json()

		const mainResume = await mainResumeService.getMainResume()
		if (!mainResume) {
			return c.json({error: "Main resume not found. Please upload your main resume first."}, 404)
		}


		const generatedResume = await generateResume(
			JSON.stringify(jobCompatibilityData), JSON.stringify(mainResume), generateCoverLetter, c.env)


		return c.json({generatedResume: generatedResume})
	} catch (error: any) {
		console.error("Error generating resume:", error)
		return c.json({error: error.message}, 500)
	}
})

// Basic error handling
app.onError((err, c) => {
	console.error(`${err}`)
	return c.text('Internal Server Error', 500)
})

export default app