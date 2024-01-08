import {useCallback, useEffect, useState} from "react"
import {AddJobButton, InferJobButton, InferJobMatchButton} from "./buttons"
import {inferJob, inferJobMatch, researchCompany} from "./data/jobInferrence"
import InferredData from "./inferredData"
import ReactMarkdown from 'react-markdown'
export default function InferredJob(
    {jobDescription, job, match}:
        {
            jobDescription: string,
            job: any,
            match: any
        }) {
    console.log({job, match})

    const [inferredJob, setInferredJob] = useState(job)
    const [inferredJobMatch, setInferredJobMatch] = useState(match)


    const [inferPending, toggleInferPending] = useState(false)
    const [inferMatchPending, toggleInferMatchPending] = useState(false)
    const [aboutCompany, setAboutCompany] = useState('')

    const updateAboutCompany = useCallback((e: string) => {
        console.log({e})
        setAboutCompany(prevAboutCompany => `${prevAboutCompany}${e.trim()}`)
    }, [])

    const onStreamingEnd = useCallback(() => {
        console.log('streaming ended')
    }, [])
    useEffect(() => {
        (async () => {
            if (inferredJob?.inferredDescription?.companyName) {
                await researchCompany(inferredJob?.inferredDescription?.companyName,
                    updateAboutCompany, onStreamingEnd)
            }
        })()

    }, [inferredJob?.inferredDescription?.companyName, updateAboutCompany, onStreamingEnd])

    async function handleInferJob() {
        toggleInferPending(true)
        const job = await inferJob(jobDescription)
        toggleInferPending(false)
        console.log({job})
        setInferredJob(job)

    }

    async function handleInferJobMatch() {
        toggleInferMatchPending(true)
        const job = await inferJobMatch(jobDescription)
        toggleInferMatchPending(false)
        setInferredJobMatch(job)

    }
    return (
        <>
            <h1 className='text-4xl font-bold text-center dark:text-white'>
                Job Description
            </h1>
            <p id='jobDescription' className='text-lg mt-4 dark:text-gray-300'>
                {jobDescription}
            </p>
            <h2 className='text-3xl font-bold mt-8 dark:text-white'>
                About Company
            </h2>
            <p className='text-lg mt-4 dark:text-gray-300'>
                <ReactMarkdown>{aboutCompany}</ReactMarkdown>
            </p>
            <h2 className='text-3xl font-bold mt-8 dark:text-white'>
                Inferred Job
            </h2>
            {
                !inferredJob || Object.keys(inferredJob).length === 0 ? (
                    <>
                        <div className='mt-4'>
                            No inferred job found. Click the button below to infer a job.
                            <InferJobButton pending={inferPending} onClick={handleInferJob} />
                        </div >

                    </>
                ) :

                    <div className='mt-4'>
                        <InferredData keyName='Company Name' value={inferredJob.inferredDescription.companyName} />
                        <InferredData keyName='Job Title' value={inferredJob.inferredDescription?.jobTitle} />
                        <InferredData keyName='Full Remote?' value={inferredJob.inferredDescription?.isRemote ?? false ? '✅' : '❌'} />
                        {!(inferredJob.inferredDescription?.isRemote ?? false) &&
                            <InferredData keyName='Job Location' value={inferredJob.inferredDescription?.location ?? ""} />

                        }
                        <InferredData keyName='Technical Skills' value={inferredJob.inferredDescription.technicalSkills.join(', ')} />
                        <InferredData keyName='Soft Skills' value={inferredJob.inferredDescription.softSkills.join(', ')} />
                        <InferredData keyName='Suger Coating Rating' value={inferredJob.inferredDescription.sugercoatingRating} />
                        <InferredData keyName='Suger Coating Rating Reason' value={inferredJob.inferredDescription.sugercoatingRatingReason} />


                        <div className='mt-4'>
                            <InferJobButton onClick={handleInferJob} pending={inferPending} defaultText='Re-Infer Job' />
                        </div >

                    </div>
            }
            <h2 className='text-3xl font-bold mt-8 dark:text-white'>
                Inferred Job Match
            </h2>
            {

                !inferredJobMatch || Object.keys(inferredJobMatch).length === 0 ? (
                    <>
                        <div className='mt-4'>
                            <input type='hidden' value={jobDescription} name='jobDescription' />

                            <InferJobMatchButton pending={inferMatchPending} onClick={handleInferJobMatch} />
                        </div >

                    </>

                ) :
                    <div className='mt-4'>
                        <InferredData keyName='Match Percentage' value={`${inferredJobMatch.compatibilityMatrix.matchPercentage}%`} />
                        <InferredData keyName='Match Reason' value={inferredJobMatch.compatibilityMatrix.matchReason} />
                        <InferredData keyName="Required Skills" value="" />

                        <InferredData keyName='Technical Skills' value={inferredJobMatch.compatibilityMatrix.requiredSkills.techSkills.join(", ")} />
                        <InferredData keyName='Soft Skills' value={inferredJobMatch.compatibilityMatrix.requiredSkills.softSkills.join(", ")} />


                        <div className='mt-4'>
                            <InferJobMatchButton pending={inferMatchPending} onClick={handleInferJobMatch} defaultText='Re-Infer Match' />
                        </div >
                        <div className="mt-5">
                            <span className="text-md">Want to infer another job? Go to <a className="border-b-2" href='/home'>Home</a> to enter a new job description.</span>
                            <p></p>
                            <p>Or</p>
                            <AddJobButton job={inferredJob} jobDescription={jobDescription} match={inferredJobMatch} />
                        </div>

                    </div>
            }

            <span className="text-md">Want to infer another job? Go to <a className="border-b-2" href='/home'>Home</a> to enter a new job description.</span>

        </>



    )
}