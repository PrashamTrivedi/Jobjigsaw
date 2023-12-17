import {cookies} from 'next/headers'
import {inferJob, inferJobMatch} from '@/app/lib/actions/jobInferrence'
import {AddJobButton, InferJobButton, InferJobMatchButton} from '@/app/ui/buttons'
import kv from '@vercel/kv'
import Link from "next/link"
import InferredData from "../ui/inferredData"
import {Metadata} from "next"

export const metadata: Metadata = {
    title: 'Inferred Job',
}
export default async function Page() {

    const jobDescription = await kv.get<string>('jobDescription') ?? ''
    const inferredJobString = await kv.get<string>('inferredJob') ?? ''
    const inferredJobMatchString = await kv.get<string>('inferredJobMatch') ?? ''

    console.log({jobDescription, inferredJobString, inferredJobMatchString})
    const inferredJob = (typeof inferredJobString === 'object') ? inferredJobString : ((inferredJobString && inferredJobString !== '') ? JSON.parse(inferredJobString) : {})
    const inferredJobMatch = (typeof inferredJobMatchString === 'object') ? inferredJobMatchString : ((inferredJobMatchString && inferredJobMatchString !== '') ? JSON.parse(inferredJobMatchString) : {})
    if (jobDescription === '') {
        return (
            <>
                <h1 className='text-4xl font-bold text-center dark:text-white'>
                    Job Description
                </h1>
                <p id='jobDescription' className='text-lg mt-4 dark:text-gray-300'>
                    No job description found. Go to <Link href='/'>home</Link> to enter a job description.
                </p>
            </>
        )
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
                Inferred Job
            </h2>

            {
                Object.keys(inferredJob).length === 0 ? (
                    <>
                        <form action={inferJob} className='mt-4'>
                            <input type='hidden' value={jobDescription} name='jobDescription' />

                            <InferJobButton />
                        </form >
                        <div className="mt-5">
                            <span className="text-md">Or go to <Link className="border-b-2" href='/'>Home</Link> to enter a new job description.</span>
                        </div>
                    </>
                ) :

                    <div className='mt-4'>
                        <InferredData keyName='Company Name' value={inferredJob.inferredDescription.companyName} />
                        <InferredData keyName='Job Title' value={inferredJob.inferredDescription.jobTitle} />
                        <InferredData keyName='Full Remote?' value={inferredJob.inferredDescription.isRemote ? '✅' : '❌'} />
                        {!inferredJob.inferredDescription.isRemote &&
                            <InferredData keyName='Job Location' value={inferredJob.inferredDescription.location} />

                        }
                        <InferredData keyName='Technical Skills' value={inferredJob.inferredDescription.technicalSkills.join(', ')} />
                        <InferredData keyName='Soft Skills' value={inferredJob.inferredDescription.softSkills.join(', ')} />
                        <InferredData keyName='Suger Coating Rating' value={inferredJob.inferredDescription.sugercoatingRating} />
                        <InferredData keyName='Suger Coating Rating Reason' value={inferredJob.inferredDescription.sugercoatingRatingReason} />


                        <form action={inferJob} className='mt-4'>
                            <input type='hidden' value={jobDescription} name='jobDescription' />
                            <InferJobButton defaultText='Re-Infer Job' />
                        </form >
                        <div className="mt-5">
                            <span className="text-md">Want to infer another job? Go to <Link className="border-b-2" href='/'>Home</Link> to enter a new job description.</span>
                        </div>
                    </div>
            }
            <h2 className='text-3xl font-bold mt-8 dark:text-white'>
                Inferred Job Match
            </h2>
            {

                Object.keys(inferredJobMatch).length === 0 ? (
                    <>
                        <form action={inferJobMatch} className='mt-4'>
                            <input type='hidden' value={jobDescription} name='jobDescription' />

                            <InferJobMatchButton />
                        </form >
                        <div className="mt-5">
                            <span className="text-md">Go to <Link className="border-b-2" href='/'>Home</Link> to enter a new job description.</span>
                        </div>
                    </>

                ) :
                    <div className='mt-4'>
                        <InferredData keyName='Match Percentage' value={`${inferredJobMatch.compatibilityMatrix.matchPercentage}%`} />
                        <InferredData keyName='Match Reason' value={inferredJobMatch.compatibilityMatrix.matchReason} />
                        <InferredData keyName="Required Skills" value="" />

                        <InferredData keyName='Technical Skills' value={inferredJobMatch.compatibilityMatrix.requiredSkills.techSkills.join(", ")} />
                        <InferredData keyName='Soft Skills' value={inferredJobMatch.compatibilityMatrix.requiredSkills.softSkills.join(", ")} />


                        <form action={inferJobMatch} className='mt-4'>
                            <input type='hidden' value={jobDescription} name='jobDescription' />

                            <InferJobMatchButton defaultText='Re-Infer Match' />
                        </form >
                        <div className="mt-5">
                            <span className="text-md">Want to infer another job? Go to <Link className="border-b-2" href='/'>Home</Link> to enter a new job description.</span>
                            <p></p>
                            <p>Or</p>
                            <AddJobButton />    
                        </div>

                    </div>
            }
        </>
    )
}