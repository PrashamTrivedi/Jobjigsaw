import {OpenAPIHono, createRoute, z} from '@hono/zod-openapi'
import {cors} from 'hono/cors'
import {logger} from 'hono/logger'
import {secureHeaders} from 'hono/secure-headers'

import {Database} from './database'
import {CloudflareKv} from './utils/cloudflareKv'
import {JobService} from './job/jobService'
import {MainResumeService} from './mainResume/mainResumeService'
import {ResumeService} from './resume/resumeService'
import {generateJsonFromResume, inferJobDescription, checkCompatiblity, generateResume, inferCompanyDetails, inferJobDescriptionFromUrl, listAvailableModels, setPreferredModel} from './openai'
import {AppError} from './types'
import * as schemas from './schemas'

// Helper function to handle errors safely
const handleError = (error: unknown, context: string, status: number = 500) => {
	const appError: AppError = {
		message: error instanceof Error ? error.message : 'Unknown error occurred',
		status,
		details: error
	}
	console.error(`${context}:`, appError)
	return {error: appError.message, status: appError.status}
}

const app = new OpenAPIHono<{Bindings: Env}>()

// Middleware
app.use('*', logger())
app.use('*', cors())
app.use('*', secureHeaders())

app.get('/', () => new Response('Hello World!'))

// Route definitions
const createJobRoute = createRoute({
	method: 'post',
	path: '/job',
	request: {
		body: {
			content: {
				'application/json': {
					schema: schemas.CreateJobSchema
				}
			}
		}
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.JobCreateResponseSchema
				}
			},
			description: 'Job created successfully'
		},
		400: {
			content: {
				'application/json': {
					schema: schemas.ErrorResponseSchema
				}
			},
			description: 'Bad request'
		}
	},
	tags: ['Jobs']
})

const getJobsRoute = createRoute({
	method: 'get',
	path: '/job',
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.JobSchema.array()
				}
			},
			description: 'List of all jobs'
		}
	},
	tags: ['Jobs']
})

const getJobByIdRoute = createRoute({
	method: 'get',
	path: '/job/{id}',
	request: {
		params: schemas.IdParamSchema
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.JobSchema
				}
			},
			description: 'Job details'
		},
		404: {
			content: {
				'application/json': {
					schema: schemas.ErrorResponseSchema
				}
			},
			description: 'Job not found'
		}
	},
	tags: ['Jobs']
})

const inferJobRoute = createRoute({
	method: 'post',
	path: '/job/infer',
	request: {
		body: {
			content: {
				'application/json': {
					schema: schemas.JobInferSchema
				}
			}
		}
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.InferredJobResponseSchema
				}
			},
			description: 'Job description inferred successfully'
		}
	},
	tags: ['Jobs']
})

const deleteJobRoute = createRoute({
	method: 'delete',
	path: '/job/{id}',
	request: {
		params: schemas.IdParamSchema
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.SuccessResponseSchema
				}
			},
			description: 'Job deleted successfully'
		},
		404: {
			content: {
				'application/json': {
					schema: schemas.ErrorResponseSchema
				}
			},
			description: 'Job not found'
		}
	},
	tags: ['Jobs']
})

const inferJobFromUrlRoute = createRoute({
	method: 'post',
	path: '/job/infer-url',
	request: {
		body: {
			content: {
				'application/json': {
					schema: schemas.JobInferUrlSchema
				}
			}
		}
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.InferredJobResponseSchema
				}
			},
			description: 'Job inferred from URL successfully'
		}
	},
	tags: ['Jobs']
})

const inferJobMatchRoute = createRoute({
	method: 'post',
	path: '/job/infer-match',
	request: {
		body: {
			content: {
				'application/json': {
					schema: schemas.JobInferMatchSchema
				}
			}
		}
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.CompatibilityResponseSchema
				}
			},
			description: 'Job compatibility analysis completed'
		},
		404: {
			content: {
				'application/json': {
					schema: schemas.ErrorResponseSchema
				}
			},
			description: 'Main resume not found'
		}
	},
	tags: ['Jobs']
})

const researchCompanyRoute = createRoute({
	method: 'get',
	path: '/job/research-company/{companyName}',
	request: {
		params: schemas.CompanyNameParamSchema
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.CompanyResearchResponseSchema
				}
			},
			description: 'Company research completed'
		}
	},
	tags: ['Jobs']
})

const analyzeJobRoute = createRoute({
	method: 'post',
	path: '/job/analyze',
	request: {
		body: {
			content: {
				'application/json': {
					schema: schemas.JobAnalyzeSchema
				}
			}
		}
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.InferredJobResponseSchema
				}
			},
			description: 'Job analyzed successfully'
		},
		404: {
			content: {
				'application/json': {
					schema: schemas.ErrorResponseSchema
				}
			},
			description: 'Main resume not found'
		}
	},
	tags: ['Jobs']
})

// Main Resume routes
const getMainResumeRoute = createRoute({
	method: 'get',
	path: '/main-resume',
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.MainResumeSchema
				}
			},
			description: 'Main resume retrieved successfully'
		},
		404: {
			content: {
				'application/json': {
					schema: schemas.ErrorResponseSchema
				}
			},
			description: 'Main resume not found'
		}
	},
	tags: ['Main Resume']
})

const uploadMainResumeRoute = createRoute({
	method: 'post',
	path: '/main-resume',
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.MainResumeSchema
				}
			},
			description: 'Resume uploaded and parsed successfully (multipart/form-data)'
		},
		400: {
			content: {
				'application/json': {
					schema: schemas.ErrorResponseSchema
				}
			},
			description: 'Bad request or file upload error'
		}
	},
	tags: ['Main Resume']
})

const updateMainResumeRoute = createRoute({
	method: 'put',
	path: '/main-resume',
	request: {
		body: {
			content: {
				'application/json': {
					schema: schemas.UpdateMainResumeSchema
				}
			}
		}
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.SuccessResponseSchema
				}
			},
			description: 'Main resume updated successfully'
		}
	},
	tags: ['Main Resume']
})

const getResumeFileRoute = createRoute({
	method: 'get',
	path: '/main-resume/file/{fileName}',
	request: {
		params: schemas.FileNameParamSchema
	},
	responses: {
		200: {
			content: {
				'application/pdf': {},
				'application/json': {}
			},
			description: 'Resume file downloaded successfully'
		},
		404: {
			content: {
				'application/json': {
					schema: schemas.ErrorResponseSchema
				}
			},
			description: 'File not found'
		}
	},
	tags: ['Main Resume']
})

// Resume routes
const createResumeRoute = createRoute({
	method: 'post',
	path: '/resume',
	request: {
		body: {
			content: {
				'application/json': {
					schema: schemas.CreateResumeSchema
				}
			}
		}
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.ResumeCreateResponseSchema
				}
			},
			description: 'Resume created successfully'
		}
	},
	tags: ['Resumes']
})

const getResumesRoute = createRoute({
	method: 'get',
	path: '/resume',
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.ResumeSchema.array()
				}
			},
			description: 'List of all resumes'
		}
	},
	tags: ['Resumes']
})

const getResumeByIdRoute = createRoute({
	method: 'get',
	path: '/resume/{id}',
	request: {
		params: schemas.IdParamSchema
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.ResumeSchema
				}
			},
			description: 'Resume details'
		},
		404: {
			content: {
				'application/json': {
					schema: schemas.ErrorResponseSchema
				}
			},
			description: 'Resume not found'
		}
	},
	tags: ['Resumes']
})

const deleteResumeRoute = createRoute({
	method: 'delete',
	path: '/resume/{id}',
	request: {
		params: schemas.IdParamSchema
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.SuccessResponseSchema
				}
			},
			description: 'Resume deleted successfully'
		},
		404: {
			content: {
				'application/json': {
					schema: schemas.ErrorResponseSchema
				}
			},
			description: 'Resume not found'
		}
	},
	tags: ['Resumes']
})

const updateResumeRoute = createRoute({
	method: 'put',
	path: '/resume/{id}',
	request: {
		params: schemas.IdParamSchema,
		body: {
			content: {
				'application/json': {
					schema: schemas.UpdateResumeSchema
				}
			}
		}
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.SuccessResponseSchema
				}
			},
			description: 'Resume updated successfully'
		},
		404: {
			content: {
				'application/json': {
					schema: schemas.ErrorResponseSchema
				}
			},
			description: 'Resume not found'
		}
	},
	tags: ['Resumes']
})

const generateResumeRoute = createRoute({
	method: 'post',
	path: '/resume/generate',
	request: {
		body: {
			content: {
				'application/json': {
					schema: schemas.GenerateResumeSchema
				}
			}
		}
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: schemas.GeneratedResumeResponseSchema
				}
			},
			description: 'Resume generated successfully'
		},
		404: {
			content: {
				'application/json': {
					schema: schemas.ErrorResponseSchema
				}
			},
			description: 'Main resume not found'
		}
	},
	tags: ['Resumes']
})

const listModelsRoute = createRoute({
        method: 'get',
        path: '/models',
        responses: {
                200: {
                        content: {
                                'application/json': {
                                        schema: schemas.ModelsResponseSchema
                                }
                        },
                        description: 'List available models'
                }
        },
        tags: ['Models']
})

const selectModelRoute = createRoute({
        method: 'post',
        path: '/model',
        request: {
                body: {
                        content: {
                                'application/json': {
                                        schema: schemas.SelectModelSchema
                                }
                        }
                }
        },
        responses: {
                200: {
                        content: {
                                'application/json': {
                                        schema: schemas.SuccessResponseSchema
                                }
                        },
                        description: 'Model selected'
                }
        },
        tags: ['Models']
})

const migrateRoute = createRoute({
        method: 'post',
        path: '/migrate',
        responses: {
                200: {
                        content: {
                                'application/json': {
                                        schema: schemas.SuccessResponseSchema
                                }
                        },
                        description: 'Migration executed'
                }
        },
        tags: ['Migrations']
})

const migrateWithParamsRoute = createRoute({
        method: 'post',
        path: '/migrate/{fromVersion}/{toVersion}',
        request: {
                params: schemas.MigrateParamsSchema
        },
        responses: {
                200: {
                        content: {
                                'application/json': {
                                        schema: schemas.SuccessResponseSchema
                                }
                        },
                        description: 'Migration executed'
                }
        },
        tags: ['Migrations']
})

// Job Routes
app.openapi(createJobRoute, async (c) => {
	try {
		const jobService = new JobService(c.env)
		const jobData = c.req.valid('json')
		const result = await jobService.createJob({
			...jobData,
			jobDateCreated: new Date().toISOString(),
			jobDateUpdated: new Date().toISOString()
		})
		return c.json({jobId: jobData.id || result.meta.last_row_id, success: result.success})
	} catch (error: unknown) {
		const {error: errorMessage, status} = handleError(error, "Error adding job")
		return c.json({error: errorMessage}, status)
	}
})

app.openapi(deleteJobRoute, async (c) => {
	try {
		const jobService = new JobService(c.env)
		const {id} = c.req.valid('param')
		const result = await jobService.deleteJob(id.toString())
		if (result.changes && result.changes > 0) {
			return c.json({success: true, message: 'Job removed successfully'})
		} else {
			return c.json({error: 'Job not found or no changes made'}, 404)
		}
	} catch (error: unknown) {
		const {error: errorMessage, status} = handleError(error, "Error removing job")
		return c.json({error: errorMessage}, status)
	}
})

app.openapi(getJobsRoute, async (c) => {
        try {
                const jobService = new JobService(c.env)
                const jobs = await jobService.getJobs()
                const kv = new CloudflareKv(c.env.VIEWED_JOBS_KV)
                const keys = await kv.list('job_')
                const cached: any[] = []
                for (const key of keys) {
                        const val = await kv.get(key)
                        if (val) {
                                cached.push({...JSON.parse(val), fromCache: true, cacheKey: key})
                        }
                }
                return c.json([...cached, ...jobs])
        } catch (error: unknown) {
                const {error: errorMessage, status} = handleError(error, "Error getting all jobs")
                return c.json({error: errorMessage}, status)
        }
})

app.openapi(getJobByIdRoute, async (c) => {
	try {
		const jobService = new JobService(c.env)
		const {id} = c.req.valid('param')
		const job = await jobService.getJobById(id.toString())
		if (!job) {
			return c.json({error: 'Job not found'}, 404)
		} else {
			return c.json(job)
		}
	} catch (error: unknown) {
		const {error: errorMessage, status} = handleError(error, "Error getting job")
		return c.json({error: errorMessage}, status)
	}
})

app.openapi(inferJobRoute, async (c) => {
        try {
                const {description, additionalFields} = c.req.valid('json')
                const inferredDescription = await inferJobDescription(description, additionalFields, c.env)

                if (Number(c.req.header('x-version') || '1') >= 2) {
                        const mainResumeService = new MainResumeService(c.env)
                        const mainResume = await mainResumeService.getMainResume()
                        if (mainResume) {
                                const jobMatch = await checkCompatiblity(description, JSON.stringify(mainResume), c.env)
                                const kv = new CloudflareKv(c.env.VIEWED_JOBS_KV)
                                await kv.put(`job_${Date.now()}`, JSON.stringify({inferredJob: inferredDescription, jobMatch}), {expirationTtl: 432000})
                        }
                }

                return c.json({inferredDescription: inferredDescription})
        } catch (error: unknown) {
                const {error: errorMessage, status} = handleError(error, "Error inferring job description")
                return c.json({error: errorMessage}, status)
        }
})

app.openapi(inferJobFromUrlRoute, async (c) => {
        try {
                const {url} = c.req.valid('json')
                const inferredDescription = await inferJobDescriptionFromUrl(url, c.env)

                if (Number(c.req.header('x-version') || '1') >= 2) {
                        const mainResumeService = new MainResumeService(c.env)
                        const mainResume = await mainResumeService.getMainResume()
                        if (mainResume) {
                                const jobMatch = await checkCompatiblity(inferredDescription || '', JSON.stringify(mainResume), c.env)
                                const kv = new CloudflareKv(c.env.VIEWED_JOBS_KV)
                                await kv.put(`job_${Date.now()}`, JSON.stringify({inferredJob: inferredDescription, jobMatch}), {expirationTtl: 432000})
                        }
                }

                return c.json({inferredDescription: inferredDescription})
        } catch (error: unknown) {
                const {error: errorMessage, status} = handleError(error, "Error inferring job from URL")
                return c.json({error: errorMessage}, status)
        }
})

app.openapi(inferJobMatchRoute, async (c) => {
	try {
		const mainResumeService = new MainResumeService(c.env)
		const {description} = c.req.valid('json')
		const mainResume = await mainResumeService.getMainResume()

		if (!mainResume) {
			return c.json({error: "Main resume not found. Please upload your main resume first."}, 404)
		}

		const compatibilityMatrix = await checkCompatiblity(description, JSON.stringify(mainResume), c.env)
		return c.json({compatibilityMatrix: compatibilityMatrix})
	} catch (error: unknown) {
		const {error: errorMessage, status} = handleError(error, "Error inferring job match")
		return c.json({error: errorMessage}, status)
	}
})

app.openapi(researchCompanyRoute, async (c) => {
	try {
		const {companyName} = c.req.valid('param')
		return c.json({companyResearch: `Research for ${companyName} is not yet implemented via AI Gateway.`})
	} catch (error: unknown) {
		const {error: errorMessage, status} = handleError(error, "Error researching company")
		return c.json({error: errorMessage}, status)
	}
})

app.openapi(analyzeJobRoute, async (c) => {
	try {
		const mainResumeService = new MainResumeService(c.env)
		const {jobUrl} = c.req.valid('json')
		const mainResume = await mainResumeService.getMainResume()

		if (!mainResume) {
			return c.json({error: "Main resume not found. Please upload your main resume first."}, 404)
		}

		const analyzedData = await inferJobDescriptionFromUrl(jobUrl, c.env)
		return c.json(analyzedData)
	} catch (error: unknown) {
		const {error: errorMessage, status} = handleError(error, "Error analyzing job")
		return c.json({error: errorMessage}, status)
	}
})


// Main Resume Routes
app.openapi(getMainResumeRoute, async (c) => {
	try {
		const mainResumeService = new MainResumeService(c.env)
		const resume = await mainResumeService.getMainResume()
		if (resume) {
			return c.json(resume)
		} else {
			return c.json({error: "Main resume not found"}, 404)
		}
	} catch (error: unknown) {
		const {error: errorMessage, status} = handleError(error, "Error getting main resume")
		return c.json({error: errorMessage}, status)
	}
})

app.openapi(uploadMainResumeRoute, async (c) => {
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
		const {error: errorMessage, status} = handleError(error, "Error uploading or parsing resume", 400)
		return c.json({error: errorMessage}, status)
	}
})

app.openapi(updateMainResumeRoute, async (c) => {
	try {
		const mainResumeService = new MainResumeService(c.env)
		const resume = c.req.valid('json')
		await mainResumeService.updateMainResume(resume)
		return c.json({success: true, message: 'Main resume updated successfully'})
	} catch (error: unknown) {
		const {error: errorMessage, status} = handleError(error, "Error updating main resume")
		return c.json({error: errorMessage}, status)
	}
})

app.openapi(getResumeFileRoute, async (c) => {
	try {
		const mainResumeService = new MainResumeService(c.env)
		const {fileName} = c.req.valid('param')
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
		const {error: errorMessage, status} = handleError(error, "Error downloading resume file")
		return c.json({error: errorMessage}, status)
	}
})

// Resume Routes
app.openapi(createResumeRoute, async (c) => {
	try {
		const resumeService = new ResumeService(c.env)
		const {jobId, updatedResume, technicalSkills, softSkills, coverLetter} = c.req.valid('json')
		const result = await resumeService.createResume({
			jobId,
			updateResume: JSON.stringify(updatedResume), technicalSkills, softSkills, coverLetter
		})
		return c.json({resumeId: result.meta.last_row_id, success: result.success})
	} catch (error: unknown) {
		const {error: errorMessage, status} = handleError(error, "Error adding resume")
		return c.json({error: errorMessage}, status)
	}
})

app.openapi(getResumesRoute, async (c) => {
	try {
		const resumeService = new ResumeService(c.env)
		const resumes = await resumeService.getResumes()
		return c.json(resumes)
	} catch (error: unknown) {
		const {error: errorMessage, status} = handleError(error, "Error getting all resumes")
		return c.json({error: errorMessage}, status)
	}
})

app.openapi(getResumeByIdRoute, async (c) => {
	try {
		const resumeService = new ResumeService(c.env)
		const {id} = c.req.valid('param')
		const resume = await resumeService.getResumeById(id.toString())
		if (!resume) {
			return c.json({error: 'Resume not found'}, 404)
		} else {
			return c.json(resume)
		}
	} catch (error: unknown) {
		const {error: errorMessage, status} = handleError(error, "Error getting resume")
		return c.json({error: errorMessage}, status)
	}
})

app.openapi(deleteResumeRoute, async (c) => {
	try {
		const resumeService = new ResumeService(c.env)
		const {id} = c.req.valid('param')
		const result = await resumeService.deleteResume(id.toString())
		if (result.changes && result.changes > 0) {
			return c.json({success: true, message: 'Resume removed successfully'})
		} else {
			return c.json({error: 'Resume not found or no changes made'}, 404)
		}
	} catch (error: unknown) {
		const {error: errorMessage, status} = handleError(error, "Error removing resume")
		return c.json({error: errorMessage}, status)
	}
})

app.openapi(updateResumeRoute, async (c) => {
	try {
		const resumeService = new ResumeService(c.env)
		const {id} = c.req.valid('param')
		const {updatedResume, technicalSkills, softSkills, coverLetter} = c.req.valid('json')
		const result = await resumeService.updateResume(
			id.toString(), {updatedResume: JSON.stringify(updatedResume), technicalSkills, softSkills, coverLetter})
		if (result.changes && result.changes > 0) {
			return c.json({success: true, message: 'Resume updated successfully'})
		} else {
			return c.json({error: 'Resume not found or no changes made'}, 404)
		}
	} catch (error: unknown) {
		const {error: errorMessage, status} = handleError(error, "Error updating resume")
		return c.json({error: errorMessage}, status)
	}
})

app.openapi(generateResumeRoute, async (c) => {
        try {
		const mainResumeService = new MainResumeService(c.env)
		const {jobCompatibilityData, generateCoverLetter} = c.req.valid('json')

		const mainResume = await mainResumeService.getMainResume()
		if (!mainResume) {
			return c.json({error: "Main resume not found. Please upload your main resume first."}, 404)
		}

		const generatedResume = await generateResume(
			JSON.stringify(jobCompatibilityData), JSON.stringify(mainResume), generateCoverLetter, c.env)

		return c.json({generatedResume: generatedResume})
	} catch (error: unknown) {
		const {error: errorMessage, status} = handleError(error, "Error generating resume")
		return c.json({error: errorMessage}, status)
        }
})

app.openapi(listModelsRoute, async (c) => {
        try {
                const models = await listAvailableModels(c.env)
                return c.json({models})
        } catch (error: unknown) {
                const {error: errorMessage, status} = handleError(error, "Error listing models")
                return c.json({error: errorMessage}, status)
        }
})

app.openapi(selectModelRoute, async (c) => {
        try {
                const {modelName, provider} = c.req.valid('json')
                await setPreferredModel(modelName, provider, c.env)
                return c.json({success: true})
        } catch (error: unknown) {
                const {error: errorMessage, status} = handleError(error, "Error selecting model")
                return c.json({error: errorMessage}, status)
        }
})

app.openapi(migrateRoute, async (c) => {
        try {
                let module
                try {
                        module = await import('./dbMigration/initDb')
                } catch (_) {
                        return c.json({error: 'initDb script not found'}, 404)
                }
                const sql = module.default as string
                await c.env.DB.exec(sql)
                return c.json({success: true})
        } catch (error: unknown) {
                const {error: errorMessage, status} = handleError(error, "Error running migration")
                return c.json({error: errorMessage}, status)
        }
})

app.openapi(migrateWithParamsRoute, async (c) => {
        try {
                const {toVersion} = c.req.valid('param')
                let module
                try {
                        module = await import(`./dbMigration/v${toVersion}.js`)
                } catch (_) {
                        return c.json({error: 'migration script not found'}, 404)
                }
                const sql = module.default as string
                await c.env.DB.exec(sql)
                return c.json({success: true})
        } catch (error: unknown) {
                const {error: errorMessage, status} = handleError(error, "Error running migration")
                return c.json({error: errorMessage}, status)
        }
})

// OpenAPI documentation endpoints
app.get('/doc', c => c.json({
	openapi: '3.0.0',
	info: {
		version: '1.0.0',
		title: 'Jobjigsaw API',
		description: 'AI-powered job application and resume customization platform API'
	},
	servers: [
		{
			url: 'http://localhost:8787',
			description: 'Development server'
		}
	],
	tags: [
		{ name: 'Jobs', description: 'Job management and analysis' },
		{ name: 'Main Resume', description: 'User\'s main resume management' },
		{ name: 'Resumes', description: 'Job-specific customized resumes' }
	],
	paths: {
		'/job': {
			post: {
				tags: ['Jobs'],
				summary: 'Create a new job',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									companyName: { type: 'string', example: 'Tech Corp' },
									jobTitle: { type: 'string', example: 'Software Engineer' },
									jobDescription: { type: 'string', example: 'We are looking for a skilled software engineer...' },
									jobUrl: { type: 'string', format: 'uri', example: 'https://example.com/job/123' },
									jobStatus: { type: 'string', example: 'active' }
								},
								required: ['companyName', 'jobTitle', 'jobDescription', 'jobStatus']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'Job created successfully',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										jobId: { type: 'number', example: 1 },
										success: { type: 'boolean', example: true }
									}
								}
							}
						}
					}
				}
			},
			get: {
				tags: ['Jobs'],
				summary: 'Get all jobs',
				responses: {
					'200': {
						description: 'List of all jobs',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: { type: 'number' },
											companyName: { type: 'string' },
											jobTitle: { type: 'string' },
											jobDescription: { type: 'string' },
											jobStatus: { type: 'string' }
										}
									}
								}
							}
						}
					}
				}
			}
		},
		'/job/{id}': {
			get: {
				tags: ['Jobs'],
				summary: 'Get job by ID',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string' }
					}
				],
				responses: {
					'200': {
						description: 'Job details',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										id: { type: 'number' },
										companyName: { type: 'string' },
										jobTitle: { type: 'string' },
										jobDescription: { type: 'string' }
									}
								}
							}
						}
					},
					'404': {
						description: 'Job not found'
					}
				}
			},
			delete: {
				tags: ['Jobs'],
				summary: 'Delete job',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string' }
					}
				],
				responses: {
					'200': {
						description: 'Job deleted successfully'
					},
					'404': {
						description: 'Job not found'
					}
				}
			}
		},
		'/job/infer': {
			post: {
				tags: ['Jobs'],
				summary: 'Infer job details from description',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									description: { type: 'string', example: 'Software Engineer position requiring React and Node.js...' },
									additionalFields: { type: 'object', example: { location: 'Remote', salary: '$120k' } }
								},
								required: ['description']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'Job description inferred successfully',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										inferredDescription: { type: 'object' }
									}
								}
							}
						}
					}
				}
			}
		},
		'/job/infer-url': {
			post: {
				tags: ['Jobs'],
				summary: 'Infer job details from URL',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									url: { type: 'string', format: 'uri', example: 'https://jobs.example.com/software-engineer' }
								},
								required: ['url']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'Job inferred from URL successfully'
					}
				}
			}
		},
		'/job/infer-match': {
			post: {
				tags: ['Jobs'],
				summary: 'Check job compatibility with main resume',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									description: { type: 'string', example: 'Software Engineer position requiring React and Node.js...' }
								},
								required: ['description']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'Job compatibility analysis completed',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										compatibilityMatrix: { type: 'object' }
									}
								}
							}
						}
					},
					'404': {
						description: 'Main resume not found'
					}
				}
			}
		},
		'/job/analyze': {
			post: {
				tags: ['Jobs'],
				summary: 'Analyze job from URL',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									jobUrl: { type: 'string', format: 'uri' }
								},
								required: ['jobUrl']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'Job analyzed successfully'
					},
					'404': {
						description: 'Main resume not found'
					}
				}
			}
		},
		'/main-resume': {
			get: {
				tags: ['Main Resume'],
				summary: 'Get main resume',
				responses: {
					'200': {
						description: 'Main resume retrieved successfully',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										id: { type: 'number' },
										resumeName: { type: 'string' },
										resumeContent: { type: 'string' },
										dateCreated: { type: 'string' },
										dateUpdated: { type: 'string' }
									}
								}
							}
						}
					},
					'404': {
						description: 'Main resume not found'
					}
				}
			},
			post: {
				tags: ['Main Resume'],
				summary: 'Upload and parse resume',
				requestBody: {
					content: {
						'multipart/form-data': {
							schema: {
								type: 'object',
								properties: {
									resume: {
										type: 'string',
										format: 'binary',
										description: 'Resume file (PDF or JSON)'
									}
								},
								required: ['resume']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'Resume uploaded and parsed successfully'
					},
					'400': {
						description: 'Bad request or file upload error'
					}
				}
			},
			put: {
				tags: ['Main Resume'],
				summary: 'Update main resume',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									resumeName: { type: 'string' },
									resumeContent: { type: 'string' }
								}
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'Main resume updated successfully'
					}
				}
			}
		},
		'/resume': {
			post: {
				tags: ['Resumes'],
				summary: 'Create customized resume',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									jobId: { type: 'number' },
									updatedResume: { type: 'object' },
									technicalSkills: { type: 'array', items: { type: 'string' } },
									softSkills: { type: 'array', items: { type: 'string' } },
									coverLetter: { type: 'string' }
								},
								required: ['jobId', 'updatedResume']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'Resume created successfully'
					}
				}
			},
			get: {
				tags: ['Resumes'],
				summary: 'Get all resumes',
				responses: {
					'200': {
						description: 'List of all resumes',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: { type: 'number' },
											resumeName: { type: 'string' },
											resumeContent: { type: 'string' },
											jobId: { type: 'number' }
										}
									}
								}
							}
						}
					}
				}
			}
		},
		'/resume/{id}': {
			get: {
				tags: ['Resumes'],
				summary: 'Get resume by ID',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string' }
					}
				],
				responses: {
					'200': {
						description: 'Resume details'
					},
					'404': {
						description: 'Resume not found'
					}
				}
			},
			put: {
				tags: ['Resumes'],
				summary: 'Update resume',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string' }
					}
				],
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									updatedResume: { type: 'object' },
									technicalSkills: { type: 'array', items: { type: 'string' } },
									softSkills: { type: 'array', items: { type: 'string' } },
									coverLetter: { type: 'string' }
								}
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'Resume updated successfully'
					},
					'404': {
						description: 'Resume not found'
					}
				}
			},
			delete: {
				tags: ['Resumes'],
				summary: 'Delete resume',
				parameters: [
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string' }
					}
				],
				responses: {
					'200': {
						description: 'Resume deleted successfully'
					},
					'404': {
						description: 'Resume not found'
					}
				}
			}
		},
                '/resume/generate': {
                        post: {
				tags: ['Resumes'],
				summary: 'Generate tailored resume',
				requestBody: {
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									jobCompatibilityData: { type: 'object' },
									generateCoverLetter: { type: 'boolean', default: false }
								},
								required: ['jobCompatibilityData']
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'Resume generated successfully',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										generatedResume: { type: 'object' }
									}
								}
							}
						}
					},
					'404': {
						description: 'Main resume not found'
					}
                                }
                        }
                },
                '/models': {
                        get: {
                                tags: ['Models'],
                                summary: 'List available models',
                                responses: {
                                        '200': {
                                                description: 'List available models',
                                                content: {
                                                        'application/json': {
                                                                schema: {
                                                                        type: 'object',
                                                                        properties: {
                                                                                models: {
                                                                                        type: 'array',
                                                                                        items: {
                                                                                                type: 'object',
                                                                                                properties: { id: { type: 'string' }, provider: { type: 'string' } }
                                                                                        }
                                                                                }
                                                                        }
                                                                }
                                                        }
                                                }
                                        }
                                }
                        }
                },
                '/model': {
                        post: {
                                tags: ['Models'],
                                summary: 'Select preferred model',
                                requestBody: {
                                        content: {
                                                'application/json': {
                                                        schema: { type: 'object', properties: { modelName: { type: 'string' }, provider: { type: 'string' } } }
                                                }
                                        }
                                },
                                responses: { '200': { description: 'Model selected' } }
                        }
                },
                '/migrate': {
                        post: {
                                tags: ['Migrations'],
                                summary: 'Run init migration',
                                responses: { '200': { description: 'Migration executed' } }
                        }
                },
                '/migrate/{fromVersion}/{toVersion}': {
                        post: {
                                tags: ['Migrations'],
                                summary: 'Run version migration',
                                parameters: [
                                        { name: 'fromVersion', in: 'path', required: true, schema: { type: 'string' } },
                                        { name: 'toVersion', in: 'path', required: true, schema: { type: 'string' } }
                                ],
                                responses: { '200': { description: 'Migration executed' } }
                        }
                }
        },
        components: {
		schemas: {
			Error: {
				type: 'object',
				properties: {
					error: { type: 'string' },
					status: { type: 'number' }
				}
			}
		}
	}
}))

// Swagger UI endpoint
app.get('/swagger', (c) => {
	return c.html(`
		<!DOCTYPE html>
		<html>
			<head>
				<title>Jobjigsaw API Documentation</title>
				<link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
			</head>
			<body>
				<div id="swagger-ui"></div>
				<script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
				<script>
					SwaggerUIBundle({
						url: '/doc',
						dom_id: '#swagger-ui',
						presets: [
							SwaggerUIBundle.presets.apis,
							SwaggerUIBundle.presets.standalone
						]
					});
				</script>
			</body>
		</html>
	`)
})

// Basic error handling
app.onError((err, c) => {
	console.error(`${err}`)
	return c.text('Internal Server Error', 500)
})

export default app