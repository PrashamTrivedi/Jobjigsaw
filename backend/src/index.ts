import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'

import { Database } from './database'
import { CloudflareKv } from './utils/cloudflareKv'
import { JobService } from './job/jobService'
import { MainResumeService } from './mainResume/mainResumeService'
import { ResumeService } from './resume/resumeService'
import { generateJsonFromResume, inferJobDescription, checkCompatiblity, generateResume, inferCompanyDetails, inferJobDescriptionFromUrl } from './openai'
import { Env, AppError } from './types'
import openapiApp from './openapi'

// Helper function to handle errors safely
const handleError = (error: unknown, context: string, status: number = 500) => {
	const appError: AppError = {
		message: error instanceof Error ? error.message : 'Unknown error occurred',
		status,
		details: error
	}
	console.error(`${context}:`, appError)
	return { error: appError.message, status: appError.status }
}

const app = new OpenAPIHono<{ Bindings: Env }>()

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
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error adding job")
		return c.json({error: errorMessage}, status)
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
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error removing job")
		return c.json({error: errorMessage}, status)
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
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error getting job")
		return c.json({error: errorMessage}, status)
	}
})

app.post('/job/infer', async (c) => {
	try {

		const {description, additionalFields} = await c.req.json()

		const inferredDescription = await inferJobDescription(description, additionalFields, c.env)

		return c.json({inferredDescription: inferredDescription})
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error inferring job description")
		return c.json({error: errorMessage}, status)
	}
})

app.post('/job/infer-url', async (c) => {
	try {
		const {url} = await c.req.json()
		const isStream = c.req.header('streaming') === 'true'

		const inferredDescription = await inferJobDescriptionFromUrl(url, c.env)
		return c.json({inferredDescription: inferredDescription})
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error inferring job from URL")
		return c.json({error: errorMessage}, status)
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
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error inferring job match")
		return c.json({error: errorMessage}, status)
	}
})

app.get('/job/research-company/:companyName', async (c) => {
	try {
		const {companyName} = c.req.param()
		const isStream = c.req.header('streaming') === 'true'

		// This functionality will be moved to a dedicated service or removed if not directly supported by AI Gateway
		// For now, returning a placeholder
		return c.json({companyResearch: `Research for ${companyName} is not yet implemented via AI Gateway.`})

	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error researching company")
		return c.json({error: errorMessage}, status)
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
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error analyzing job")
		return c.json({error: errorMessage}, status)
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
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error getting main resume")
		return c.json({error: errorMessage}, status)
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
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error uploading or parsing resume", 400)
		return c.json({error: errorMessage}, status)
	}
})

app.put('/main-resume', async (c) => {
	try {
		const mainResumeService = new MainResumeService(c.env)
		const resume = await c.req.json()
		await mainResumeService.updateMainResume(resume)
		return c.json({message: 'Main resume updated successfully'})
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error updating main resume")
		return c.json({error: errorMessage}, status)
	}
})

app.get('/main-resume/file/:fileName', async (c) => {
	try {
		const mainResumeService = new MainResumeService(c.env)
		const { fileName } = c.req.param()
		const fileStream = await mainResumeService.getResumeFile(fileName)
		
		if (!fileStream) {
			return c.json({error: 'File not found'}, 404)
		}
		
		return new Response(fileStream, {
			headers: {
				'Content-Type': fileName.endsWith('.pdf') ? 'application/pdf' : 'application/json',
				'Content-Disposition': `attachment; filename="${fileName}"`
			}
		})
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error downloading resume file")
		return c.json({error: errorMessage}, status)
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
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error adding resume")
		return c.json({error: errorMessage}, status)
	}
})

app.get('/resume', async (c) => {
	try {
		const resumeService = new ResumeService(c.env)
		const resumes = await resumeService.getResumes()
		return c.json(resumes)
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error getting all resumes")
		return c.json({error: errorMessage}, status)
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
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error getting resume")
		return c.json({error: errorMessage}, status)
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
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error removing resume")
		return c.json({error: errorMessage}, status)
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
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error updating resume")
		return c.json({error: errorMessage}, status)
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
	} catch (error: unknown) {
		const { error: errorMessage, status } = handleError(error, "Error generating resume")
		return c.json({error: errorMessage}, status)
	}
})

// Basic error handling
app.onError((err, c) => {
	console.error(`${err}`)
	return c.text('Internal Server Error', 500)
})

app.route('/', openapiApp)

app.doc('/doc', {
	openapi: '3.0.0',
	info: {
		version: '1.0.0',
		title: 'My API',
	},
})

export default app