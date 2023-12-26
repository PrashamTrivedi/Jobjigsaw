import {Suspense, useEffect, useRef, useState} from "react"
import MainContent from "./mainContent"
import ResumeComponent from "./resume"
import {useSearchParams} from "react-router-dom"
import {Resume} from "./data/mainResume"
import {createResume, generateResume, getResumeById, printResume} from "./data/resumes"
import {getJob} from "./data/jobs"
import {CopyButton} from "./buttons"


export default function Resumes() {
    const [searchParams, _] = useSearchParams()
    const jobId = searchParams.get("jobId")
    const resumeId = searchParams.get("resumeId")





    return (
        <MainContent>
            {
                ((!jobId && !resumeId) || (jobId === '' && resumeId === '')) ?
                    <div className="bg-gray-800 rounded-lg p-4 my-4 space-y-4">
                        <div className="space-y-2 mt-2">
                            <div className="text-lg"><strong>No Job ID or resumeID provided</strong></div>
                        </div>
                    </div>
                    :

                    <Suspense fallback={<div>Loading...</div>}>
                        <ResumeWithCoverLetterComponent jobId={jobId} resumeId={resumeId} />
                    </Suspense>}
        </MainContent>
    )
}


function ResumeWithCoverLetterComponent({jobId, resumeId}: {jobId: string | null, resumeId: string | null}) {
    const [resume, setResume] = useState<Resume>({
        about: {
            summary: "",
            highlights: []
        },
        certifications: [],
        contactDetails: {
            name: "",
            email: "",
            phone: "",
            website: "",
            github: "",
            linkedin: ""
        },
        education: [],
        projects: [],
        skills: [],
        workExperience: []
    })

    const [coverLetter, setCoverLetter] = useState<string>("")
    const [isPrinting, setIsPrinting] = useState<boolean>(false)
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const resumeRef = useRef(null)

    useEffect(() => {
        (async () => {
            if (resumeId) {
                console.log("Ignoring JOB ID parameter.")
                const resume = await getResumeById(resumeId)
                setResume(resume)
            }
            else if (jobId) {
                console.log("Parsing from job id means resumeId is not provided.")
                const jobData = await getJob(jobId)
                const compatibilityData = jobData.inferredJobMatch
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
    })
    async function printPdf() {
        setIsPrinting(true)
        const resumeName = `resume-${resume.contactDetails.name}.pdf`
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
        <>
            <div ref={resumeRef}>

                <ResumeComponent resume={resume} />
            </div>
            <button className="dark:border dark:border-white dark:hover:bg-gray-900 dark:text-white px-4 py-2 mt-2 rounded-md" onClick={printPdf}>
                {isPrinting ? 'Printing Resume' : 'Print Resume'}
            </button>
            <button className="dark:border dark:border-white dark:hover:bg-gray-900 dark:text-white px-4 py-2 mt-2 mx-2 rounded-md" onClick={addResume}>
                {isAdding ? 'Adding Resume' : 'Add Resume'}
            </button>
            <div className="dark:bg-gray-800 rounded-lg p-4 my-4 space-y-4">
                <div className="space-y-2 mt-2">
                    <div className="text-lg"><strong>Cover Letter</strong>
                        <CopyButton text={coverLetter} />
                    </div>

                    <div className="text-sm dark:text-gray-400">This is a generated cover letter based on the job description.</div>
                </div>
                <div className="text-sm dark:text-gray-400">
                    {coverLetter}
                </div>
            </div>
        </>
    )
}