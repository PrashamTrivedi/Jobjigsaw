import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { JobService } from './job/jobService'
import { Env } from './types'

const openapiApp = new OpenAPIHono<{ Bindings: Env }>()

const GetJobsSchema = z.array(
  z.object({
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
)

const getJobsRoute = createRoute({
  method: 'get',
  path: '/job',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetJobsSchema,
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

export default openapiApp
