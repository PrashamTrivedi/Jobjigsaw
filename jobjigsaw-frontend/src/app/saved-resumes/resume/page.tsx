'use client'

import {Suspense, useEffect, useRef, useState} from "react"
import ResumeComponent from "@/components/ResumeComponent"
import CopyButton from "@/components/CopyButton"
import {Resume} from "@/types/resume"
import {useSearchParams} from 'next/navigation'

async function getResumeById(id: string): Promise<any> {
    const response = await fetch(`/api/resume/${id}`)
    if (!response.ok) {
        throw new Error('Failed to fetch resume by ID')
    }
    return response.json()
}

async function getJob(id: string): Promise<any> {
    const response = await fetch(`/api/job/${id}`)
    if (!response.ok) {
        throw new Error('Failed to fetch job')
    }
    return response.json()
}

async function generateResume(jobCompatibilityData: any, generateCoverLetter: boolean): Promise<any> {
    const response = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({jobCompatibilityData, generateCoverLetter}),
    })
    if (!response.ok) {
        throw new Error('Failed to generate resume')
    }
    return response.json()
}

async function printResume(data: {resumeJson: any, resumeName: string}): Promise<any> {
    const response = await fetch('/api/resume/print', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        throw new Error('Failed to print resume')
    }
    return response.blob()
}

async function createResume(body: {jobId: string, updatedResume: any, technicalSkills: string, softSkills: string, coverLetter: string}): Promise<any> {
    const response = await fetch('/api/resume', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
    })
    if (!response.ok) {
        throw new Error('Failed to create resume')
    }
    return response.json()
}

export default function ResumesPage() {
    const searchParams = useSearchParams()
    const jobId = searchParams.get("jobId")
    const resumeId = searchParams.get("resumeId")

    if ((!jobId && !resumeId) || (jobId === '' && resumeId === '')) {
        return (
            <div className="mx-auto px-6 py-8">
                <div className="bg-secondary rounded-lg p-6 text-center">
                    <h2 className="text-heading-2 font-semibold text-foreground mb-2">Missing Parameters</h2>
                    <p className="text-body text-muted-foreground">No Job ID or Resume ID provided</p>
                </div>
            </div>
        )
    } else {
        return (
            <Suspense fallback={
                <div className="mx-auto px-6 py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
            }>
                <ResumeWithCoverLetterComponent jobId={jobId} resumeId={resumeId} />
            </Suspense>
        )
    }
}

function ResumeWithCoverLetterComponent({jobId, resumeId}: {jobId: string | null, resumeId: string | null}) {
    const [resume, setResume] = useState<Resume>({
        basics: {
            name: "",
            label: "",
            email: "",
            phone: "",
            url: "",
            summary: "",
            location: {
                address: "",
                postalCode: "",
                city: "",
                countryCode: "",
                region: "",
            },
            profiles: [],
        },
        workExperience: [],
        education: [],
        awards: [],
        skills: [],
        languages: [],
        interests: [],
        references: [],
        projects: [],
        certifications: [],
    })

    const [coverLetter, setCoverLetter] = useState<string>("")
    const [isPrinting, setIsPrinting] = useState<boolean>(false)
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [companyName, setCompanyName] = useState<string>("")
    const resumeRef = useRef(null)

    useEffect(() => {
        (async () => {
            if (resumeId) {
                console.log("Ignoring JOB ID parameter.")
                const resume = await getResumeById(resumeId)
                setResume(JSON.parse(resume.updated_resume))
                setCoverLetter(resume.cover_letter)
            } else if (jobId) {
                console.log("Parsing from job id means resumeId is not provided.")
                const jobData = await getJob(jobId)
                const compatibilityData = jobData.inferredJobMatch
                setCompanyName(jobData.companyName)
                if (compatibilityData) {
                    const compatibilityJson = JSON.parse(compatibilityData)
                    const jsonData = {
                        title: jobData.post,
                        company: jobData.companyName,
                        techinicalSkills: compatibilityJson.compatibilityMatrix.requiredSkills.techSkills,
                        softSkills: compatibilityJson.compatibilityMatrix.requiredSkills.softSkills,
                    }

                    const inferredResume = await generateResume(jsonData, true)
                    console.log(inferredResume)
                    setResume(inferredResume.resumeDetails.generatedResume)
                    setCoverLetter(inferredResume.resumeDetails.coverLetter)

                }
            }

        })()
    }, [resumeId, jobId])
    async function printPdf() {
        setIsPrinting(true)

        const resumeName = `Resume: ${resume.basics.name} - ${companyName}.pdf`
        const printedResume = await printResume({resumeJson: resume, resumeName})
        // Download the file
        const url = window.URL.createObjectURL(new Blob([printedResume]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', resumeName)
        document.body.appendChild(link)
        link.click()
        setIsPrinting(false)

    }

    async function addResume() {
        if (jobId) {
            setIsAdding(true)
            const jobData = await getJob(jobId)
            const compatibilityData = jobData.inferredJobMatch ?? "{}"

            const compatibilityJson = JSON.parse(compatibilityData)
            const resumeData = {
                jobId: jobId,
                updatedResume: resume,
                coverLetter: coverLetter,
                technicalSkills: JSON.stringify(compatibilityJson.compatibilityMatrix.requiredSkills.techSkills),
                softSkills: JSON.stringify(compatibilityJson.compatibilityMatrix.requiredSkills.softSkills)
            }
            await createResume(resumeData)
            setIsAdding(false)
        }
    }
    return (
        <div className="mx-auto px-6 py-8 space-y-8">
            <div ref={resumeRef}>
                <ResumeComponent initialResume={resume} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    className="px-6 py-3 border border-border rounded-md text-foreground bg-background hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={printPdf}
                >
                    {isPrinting ? 'Printing Resume' : 'Print Resume'}
                </button>
                {(!resumeId || resumeId === '') && (
                    <button
                        className="px-6 py-3 border border-transparent rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        onClick={addResume}
                    >
                        {isAdding ? 'Adding Resume' : 'Add Resume'}
                    </button>
                )}
            </div>

            <div className="bg-secondary rounded-lg p-6 space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-heading-3 font-semibold text-foreground">Cover Letter</h3>
                        <CopyButton text={coverLetter} />
                    </div>
                    <p className="text-body-sm text-muted-foreground">This is a generated cover letter based on the job description.</p>
                </div>
                <div className="text-body text-foreground whitespace-pre-wrap">
                    {coverLetter}
                </div>
            </div>
        </div>
    )
}
