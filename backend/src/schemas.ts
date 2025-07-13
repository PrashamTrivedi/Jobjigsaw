import { z } from '@hono/zod-openapi'

// Job schemas
export const JobSchema = z.object({
    id: z.number().optional().openapi({ example: 1 }),
    companyName: z.string().openapi({ example: 'Tech Corp' }),
    jobTitle: z.string().openapi({ example: 'Software Engineer' }),
    jobDescription: z.string().openapi({ example: 'We are looking for a skilled software engineer...' }),
    jobUrl: z.string().url().optional().openapi({ example: 'https://example.com/job/123' }),
    jobStatus: z.string().openapi({ example: 'active' }),
    jobSource: z.string().optional().openapi({ example: 'LinkedIn' }),
    jobType: z.string().optional().openapi({ example: 'Full-time' }),
    jobLocation: z.string().optional().openapi({ example: 'San Francisco, CA' }),
    jobSalary: z.string().optional().openapi({ example: '$100,000 - $150,000' }),
    jobContact: z.string().optional().openapi({ example: 'hr@techcorp.com' }),
    jobNotes: z.string().optional().openapi({ example: 'Applied through referral' }),
    jobDateApplied: z.string().optional().openapi({ example: '2025-01-15' }),
    jobDateCreated: z.string().openapi({ example: '2025-01-15T10:00:00Z' }),
    jobDateUpdated: z.string().openapi({ example: '2025-01-15T10:00:00Z' }),
    inferredData: z.string().optional().openapi({ example: '{"skills":["React","Node.js"]}' }),
    jobFitScore: z.number().min(0).max(100).optional().openapi({ example: 85 }),
    jobFitBreakdown: z.string().optional().openapi({ example: '{"technical":90,"experience":80}' })
}).openapi('Job')

export const CreateJobSchema = JobSchema.omit({ id: true, jobDateCreated: true, jobDateUpdated: true })

export const JobInferSchema = z.object({
    description: z.string().openapi({ example: 'Software Engineer position requiring React and Node.js experience...' }),
    additionalFields: z.record(z.any()).optional().openapi({ example: { location: 'Remote', salary: '$120k' } })
}).openapi('JobInfer')

export const JobInferUrlSchema = z.object({
    url: z.string().url().openapi({ example: 'https://jobs.example.com/software-engineer' })
}).openapi('JobInferUrl')

export const JobInferMatchSchema = z.object({
    description: z.string().openapi({ example: 'Software Engineer position requiring React and Node.js...' })
}).openapi('JobInferMatch')

export const JobAnalyzeSchema = z.object({
    jobUrl: z.string().url().openapi({ example: 'https://jobs.example.com/software-engineer' })
}).openapi('JobAnalyze')

// Resume schemas
export const ResumeSchema = z.object({
    id: z.number().optional().openapi({ example: 1 }),
    resumeName: z.string().openapi({ example: 'Software Engineer Resume - TechCorp' }),
    resumeContent: z.string().openapi({ example: '{"contact":{"name":"John Doe"},"skills":["React","Node.js"]}' }),
    jobId: z.number().optional().openapi({ example: 1 }),
    dateCreated: z.string().openapi({ example: '2025-01-15T10:00:00Z' }),
    dateUpdated: z.string().openapi({ example: '2025-01-15T10:00:00Z' })
}).openapi('Resume')

export const CreateResumeSchema = z.object({
    jobId: z.number().openapi({ example: 1 }),
    updatedResume: z.record(z.any()).openapi({ example: { contact: { name: 'John Doe' }, skills: ['React', 'Node.js'] } }),
    technicalSkills: z.array(z.string()).optional().openapi({ example: ['React', 'Node.js', 'TypeScript'] }),
    softSkills: z.array(z.string()).optional().openapi({ example: ['Communication', 'Teamwork'] }),
    coverLetter: z.string().optional().openapi({ example: 'Dear Hiring Manager...' })
}).openapi('CreateResume')

export const UpdateResumeSchema = z.object({
    updatedResume: z.record(z.any()).openapi({ example: { contact: { name: 'John Doe' }, skills: ['React', 'Node.js'] } }),
    technicalSkills: z.array(z.string()).optional().openapi({ example: ['React', 'Node.js', 'TypeScript'] }),
    softSkills: z.array(z.string()).optional().openapi({ example: ['Communication', 'Teamwork'] }),
    coverLetter: z.string().optional().openapi({ example: 'Dear Hiring Manager...' })
}).openapi('UpdateResume')

export const GenerateResumeSchema = z.object({
    jobCompatibilityData: z.record(z.any()).openapi({ example: { score: 85, missingSkills: ['Docker'] } }),
    generateCoverLetter: z.boolean().optional().default(false).openapi({ example: true })
}).openapi('GenerateResume')

// Main Resume schemas
export const MainResumeSchema = z.object({
    id: z.number().openapi({ example: 1 }),
    resumeName: z.string().openapi({ example: 'John Doe - Software Engineer' }),
    resumeContent: z.string().openapi({ example: '{"contact":{"name":"John Doe"},"experience":[]}' }),
    dateCreated: z.string().openapi({ example: '2025-01-15T10:00:00Z' }),
    dateUpdated: z.string().openapi({ example: '2025-01-15T10:00:00Z' })
}).openapi('MainResume')

export const UpdateMainResumeSchema = z.object({
    resumeName: z.string().optional(),
    resumeContent: z.string().optional(),
    fileBuffer: z.instanceof(ArrayBuffer).optional(),
    fileType: z.string().optional()
}).openapi('UpdateMainResume')

// Common parameter schemas
export const IdParamSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number).openapi({ param: { name: 'id', in: 'path' }, example: '1' })
})

export const FileNameParamSchema = z.object({
    fileName: z.string().openapi({ param: { name: 'fileName', in: 'path' }, example: 'resume.pdf' })
})

export const CompanyNameParamSchema = z.object({
    companyName: z.string().openapi({ param: { name: 'companyName', in: 'path' }, example: 'TechCorp' })
})

// Response schemas
export const SuccessResponseSchema = z.object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().optional().openapi({ example: 'Operation completed successfully' })
}).openapi('SuccessResponse')

export const ErrorResponseSchema = z.object({
    error: z.string().openapi({ example: 'Something went wrong' }),
    status: z.number().optional().openapi({ example: 500 })
}).openapi('ErrorResponse')

export const JobCreateResponseSchema = z.object({
    jobId: z.number().openapi({ example: 1 }),
    success: z.boolean().openapi({ example: true })
}).openapi('JobCreateResponse')

export const ResumeCreateResponseSchema = z.object({
    resumeId: z.number().openapi({ example: 1 }),
    success: z.boolean().openapi({ example: true })
}).openapi('ResumeCreateResponse')

export const InferredJobResponseSchema = z.object({
    inferredDescription: z.record(z.any()).openapi({ example: { title: 'Software Engineer', skills: ['React', 'Node.js'] } })
}).openapi('InferredJobResponse')

export const CompatibilityResponseSchema = z.object({
    compatibilityMatrix: z.record(z.any()).openapi({ example: { score: 85, missingSkills: ['Docker'], strengths: ['React experience'] } })
}).openapi('CompatibilityResponse')

export const GeneratedResumeResponseSchema = z.object({
    generatedResume: z.record(z.any()).openapi({ example: { contact: { name: 'John Doe' }, experience: [] } })
}).openapi('GeneratedResumeResponse')

export const CompanyResearchResponseSchema = z.object({
    companyResearch: z.string().openapi({ example: 'TechCorp is a leading technology company...' })
}).openapi('CompanyResearchResponse')