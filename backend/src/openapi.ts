import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { JobService } from './job/jobService'
import { MainResumeService } from './mainResume/mainResumeService'
import { ResumeService } from './resume/resumeService'
import { generateJsonFromResume, inferJobDescription, checkCompatiblity, generateResume, inferCompanyDetails, inferJobDescriptionFromUrl } from './openai'
import { Env, AppError } from './types'

const openapiApp = new OpenAPIHono<{ Bindings: Env }>()

const JobSchema = z.object({
	id: z.string(),
	jobTitle: z.string(),
	company: z.string(),
	jobDescription: z.string(),
	jobUrl: z.string().url(),
	jobLocation: z.string(),
	jobType: z.string(),
	salary: z.string(),
	postedDate: z.string(),
	applicationDeadline: z.string(),
	contactEmail: z.string().email(),
	contactPhone: z.string(),
	responsibilities: z.string(),
	requirements: z.string(),
	benefits: z.string(),
	aboutCompany: z.string(),
	howToApply: z.string(),
	jobFitScore: z.number(),
	jobFitBreakdown: z.string(),
	inferredData: z.string(),
})

const getJobsRoute = createRoute({
	method: 'get',
	path: '/job',
	responses: {
		200: {
			content: {
				'application/json': {
					schema: z.array(JobSchema),
				},
			},
			description: 'Retrieve all jobs',
		},
	},
})

openapiApp.openapi(getJobsRoute, async (c) => {
	const jobService = new JobService(c.env)
	const jobs = await jobService.getJobs()
	return c.json(jobs)
})

const getJobByIdRoute = createRoute({
	method: 'get',
	path: '/job/{id}',
	request: {
		params: z.object({
			id: z.string(),
		}),
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: JobSchema,
				},
			},
			description: 'Retrieve a job by its ID',
		},
		404: {
			description: 'Job not found',
		},
	},
})

openapiApp.openapi(getJobByIdRoute, async (c) => {
	const jobService = new JobService(c.env)
	const { id } = c.req.valid('param')
	const job = await jobService.getJobById(id)
	if (!job) {
		return c.json({ message: 'Job not found' }, 404)
	}
	return c.json(job)
})

const createJobRoute = createRoute({
	method: 'post',
	path: '/job',
	request: {
		body: {
			content: {
				'application/json': {
					schema: JobSchema.omit({ id: true }),
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: z.object({
						jobId: z.string(),
						success: z.boolean(),
					}),
				},
			},
			description: 'Create a new job',
		},
	},
})

openapiApp.openapi(createJobRoute, async (c) => {
	const jobService = new JobService(c.env)
	const jobData = c.req.valid('json')
	const result = await jobService.createJob({ ...jobData, id: crypto.randomUUID() })
	return c.json({ jobId: result.id, success: result.success })
})

const deleteJobRoute = createRoute({
	method: 'delete',
	path: '/job/{id}',
	request: {
		params: z.object({
			id: z.string(),
		}),
	},
	responses: {
		200: {
			description: 'Job deleted successfully',
		},
		404: {
			description: 'Job not found',
		},
	},
})

openapiApp.openapi(deleteJobRoute, async (c) => {
	const jobService = new JobService(c.env)
	const { id } = c.req.valid('param')
	const result = await jobService.deleteJob(id)
	if (result.changes && result.changes > 0) {
		return c.json({ message: 'Job removed successfully' })
	}
	return c.json({ message: 'Job not found or no changes made' }, 404)
})

const inferJobDescriptionRoute = createRoute({
	method: 'post',
	path: '/job/infer',
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						description: z.string(),
						additionalFields: z.array(z.string()).optional(),
					}),
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: z.object({
						inferredDescription: z.any(),
					}),
				},
			},
			description: 'Infer job description',
		},
	},
})

openapiApp.openapi(inferJobDescriptionRoute, async (c) => {
	const { description, additionalFields } = c.req.valid('json')
	const inferredDescription = await inferJobDescription(description, additionalFields, c.env)
	return c.json({ inferredDescription })
})

const inferJobFromUrlRoute = createRoute({
	method: 'post',
	path: '/job/infer-url',
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						url: z.string().url(),
					}),
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: z.object({
						inferredDescription: z.any(),
					}),
				},
			},
			description: 'Infer job description from URL',
		},
	},
})

openapiApp.openapi(inferJobFromUrlRoute, async (c) => {
	const { url } = c.req.valid('json')
	const inferredDescription = await inferJobDescriptionFromUrl(url, c.env)
	return c.json({ inferredDescription })
})

const inferJobMatchRoute = createRoute({
	method: 'post',
	path: '/job/infer-match',
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						description: z.string(),
					}),
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: z.object({
						compatibilityMatrix: z.any(),
					}),
				},
			},
			description: 'Infer job match',
		},
		404: {
			description: 'Main resume not found',
		},
	},
})

openapiApp.openapi(inferJobMatchRoute, async (c) => {
	const mainResumeService = new MainResumeService(c.env)
	const { description } = c.req.valid('json')
	const mainResume = await mainResumeService.getMainResume()
	if (!mainResume) {
		return c.json({ error: 'Main resume not found. Please upload your main resume first.' }, 404)
	}
	const compatibilityMatrix = await checkCompatiblity(description, JSON.stringify(mainResume), c.env)
	return c.json({ compatibilityMatrix })
})

const researchCompanyRoute = createRoute({
	method: 'get',
	path: '/job/research-company/{companyName}',
	request: {
		params: z.object({
			companyName: z.string(),
		}),
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: z.object({
						companyResearch: z.string(),
					}),
				},
			},
			description: 'Research company',
		},
	},
})

openapiApp.openapi(researchCompanyRoute, async (c) => {
	const { companyName } = c.req.valid('param')
	return c.json({ companyResearch: `Research for ${companyName} is not yet implemented via AI Gateway.` })
})

const analyzeJobRoute = createRoute({
	method: 'post',
	path: '/job/analyze',
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						jobUrl: z.string().url(),
					}),
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: z.any(),
				},
			},
			description: 'Analyze job',
		},
		404: {
			description: 'Main resume not found',
		},
	},
})

openapiApp.openapi(analyzeJobRoute, async (c) => {
	const mainResumeService = new MainResumeService(c.env)
	const { jobUrl } = c.req.valid('json')
	const mainResume = await mainResumeService.getMainResume()
	if (!mainResume) {
		return c.json({ error: 'Main resume not found. Please upload your main resume first.' }, 404)
	}
	const analyzedData = await inferJobDescriptionFromUrl(jobUrl, c.env)
	return c.json(analyzedData)
})

const getMainResumeRoute = createRoute({
	method: 'get',
	path: '/main-resume',
	responses: {
		200: {
			content: {
				'application/json': {
					schema: z.any(),
				},
			},
			description: 'Get main resume',
		},
		404: {
			description: 'Main resume not found',
		},
	},
})

openapiApp.openapi(getMainResumeRoute, async (c) => {
	const mainResumeService = new MainResumeService(c.env)
	const resume = await mainResumeService.getMainResume()
	if (resume) {
		return c.json(resume)
	}
	return c.json({ message: 'Main resume not found' }, 404)
})

const uploadMainResumeRoute = createRoute({
	method: 'post',
	path: '/main-resume',
	request: {
		body: {
			content: {
				'multipart/form-data': {
					schema: {
						type: 'object',
						properties: {
							resume: {
								type: 'string',
								format: 'binary',
							},
						},
					},
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: z.any(),
				},
			},
			description: 'Upload main resume',
		},
		400: {
			description: 'No file uploaded',
		},
	},
})

openapiApp.openapi(uploadMainResumeRoute, async (c) => {
	const mainResumeService = new MainResumeService(c.env)
	const formData = await c.req.formData()
	const file = formData.get('resume') as File
	if (!file) {
		return c.json({ error: 'No file uploaded.' }, 400)
	}
	const fileBuffer = await file.arrayBuffer()
	const fileType = file.type
	const parsedResume = await mainResumeService.updateMainResume({ fileBuffer, fileType })
	return c.json(parsedResume)
})

const updateMainResumeRoute = createRoute({
	method: 'put',
	path: '/main-resume',
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.any(),
				},
			},
		},
	},
	responses: {
		200: {
			description: 'Main resume updated successfully',
		},
	},
})

openapiApp.openapi(updateMainResumeRoute, async (c) => {
	const mainResumeService = new MainResumeService(c.env)
	const resume = await c.req.json()
	await mainResumeService.updateMainResume(resume)
	return c.json({ message: 'Main resume updated successfully' })
})

const getResumeFileRoute = createRoute({
	method: 'get',
	path: '/main-resume/file/{fileName}',
	request: {
		params: z.object({
			fileName: z.string(),
		}),
	},
	responses: {
		200: {
			description: 'Get resume file',
		},
		404: {
			description: 'File not found',
		},
	},
})

openapiApp.openapi(getResumeFileRoute, async (c) => {
	const mainResumeService = new MainResumeService(c.env)
	const { fileName } = c.req.valid('param')
	const fileStream = await mainResumeService.getResumeFile(fileName)
	if (!fileStream) {
		return c.json({ error: 'File not found' }, 404)
	}
	return new Response(fileStream, {
		headers: {
			'Content-Type': fileName.endsWith('.pdf') ? 'application/pdf' : 'application/json',
			'Content-Disposition': `attachment; filename="${fileName}"`,
		},
	})
})

const ResumeSchema = z.object({
	id: z.string(),
	jobId: z.string(),
	updatedResume: z.string(),
	technicalSkills: z.string(),
	softSkills: z.string(),
	coverLetter: z.string(),
})

const getResumesRoute = createRoute({
	method: 'get',
	path: '/resume',
	responses: {
		200: {
			content: {
				'application/json': {
					schema: z.array(ResumeSchema),
				},
			},
			description: 'Retrieve all resumes',
		},
	},
})

openapiApp.openapi(getResumesRoute, async (c) => {
	const resumeService = new ResumeService(c.env)
	const resumes = await resumeService.getResumes()
	return c.json(resumes)
})

const getResumeByIdRoute = createRoute({
	method: 'get',
	path: '/resume/{id}',
	request: {
		params: z.object({
			id: z.string(),
		}),
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: ResumeSchema,
				},
			},
			description: 'Retrieve a resume by its ID',
		},
		404: {
			description: 'Resume not found',
		},
	},
})

openapiApp.openapi(getResumeByIdRoute, async (c) => {
	const resumeService = new ResumeService(c.env)
	const { id } = c.req.valid('param')
	const resume = await resumeService.getResumeById(id)
	if (!resume) {
		return c.json({ message: 'Resume not found' }, 404)
	}
	return c.json(resume)
})

const createResumeRoute = createRoute({
	method: 'post',
	path: '/resume',
	request: {
		body: {
			content: {
				'application/json': {
					schema: ResumeSchema.omit({ id: true }),
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: z.object({
						resumeId: z.number(),
						success: z.boolean(),
					}),
				},
			},
			description: 'Create a new resume',
		},
	},
})

openapiApp.openapi(createResumeRoute, async (c) => {
	const resumeService = new ResumeService(c.env)
	const { jobId, updatedResume, technicalSkills, softSkills, coverLetter } = c.req.valid('json')
	const result = await resumeService.createResume({
		jobId,
		updateResume: JSON.stringify(updatedResume),
		technicalSkills,
		softSkills,
		coverLetter,
	})
	return c.json({ resumeId: result.meta.last_row_id, success: result.success })
})

const deleteResumeRoute = createRoute({
	method: 'delete',
	path: '/resume/{id}',
	request: {
		params: z.object({
			id: z.string(),
		}),
	},
	responses: {
		200: {
			description: 'Resume deleted successfully',
		},
		404: {
			description: 'Resume not found',
		},
	},
})

openapiApp.openapi(deleteResumeRoute, async (c) => {
	const resumeService = new ResumeService(c.env)
	const { id } = c.req.valid('param')
	const result = await resumeService.deleteResume(id)
	if (result.changes && result.changes > 0) {
		return c.json({ message: 'Resume removed successfully' })
	}
	return c.json({ message: 'Resume not found or no changes made' }, 404)
})

const updateResumeRoute = createRoute({
	method: 'put',
	path: '/resume/{id}',
	request: {
		params: z.object({
			id: z.string(),
		}),
		body: {
			content: {
				'application/json': {
					schema: ResumeSchema.omit({ id: true, jobId: true }),
				},
			},
		},
	},
	responses: {
		200: {
			description: 'Resume updated successfully',
		},
		404: {
			description: 'Resume not found',
		},
	},
})

openapiApp.openapi(updateResumeRoute, async (c) => {
	const resumeService = new ResumeService(c.env)
	const { id } = c.req.valid('param')
	const { updatedResume, technicalSkills, softSkills, coverLetter } = c.req.valid('json')
	const result = await resumeService.updateResume(id, {
		updatedResume: JSON.stringify(updatedResume),
		technicalSkills,
		softSkills,
		coverLetter,
	})
	if (result.changes && result.changes > 0) {
		return c.json({ message: 'Resume updated successfully' })
	}
	return c.json({ message: 'Resume not found or no changes made' }, 404)
})

const generateResumeRoute = createRoute({
	method: 'post',
	path: '/resume/generate',
	request: {
		body: {
			content: {
				'application/json': {
					schema: z.object({
						jobCompatibilityData: z.any(),
						generateCoverLetter: z.boolean(),
					}),
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: z.object({
						generatedResume: z.any(),
					}),
				},
			},
			description: 'Generate a new resume',
		},
		404: {
			description: 'Main resume not found',
		},
	},
})

openapiApp.openapi(generateResumeRoute, async (c) => {
	const mainResumeService = new MainResumeService(c.env)
	const { jobCompatibilityData, generateCoverLetter } = c.req.valid('json')
	const mainResume = await mainResumeService.getMainResume()
	if (!mainResume) {
		return c.json({ error: 'Main resume not found. Please upload your main resume first.' }, 404)
	}
	const generatedResume = await generateResume(
		JSON.stringify(jobCompatibilityData),
		JSON.stringify(mainResume),
		generateCoverLetter,
		c.env
	)
	return c.json({ generatedResume })
})

export default openapiApp
