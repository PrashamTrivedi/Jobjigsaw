
import Link from "next/link"
import {useSearchParams} from "next/navigation"
import {Job, addJob} from "../lib/actions/jobs"
import {kv} from "@vercel/kv"

export default async function Page({
    searchParams
}: {
    searchParams: {
        fromInferred?: string

    }
}) {

    console.log({searchParams})
    const isFromInferred = searchParams?.fromInferred === '' ?? false
    console.log({isFromInferred})
    let isRemote = false
    let jobData: Job = {
        text: '',
        url: '',
        companyName: '',
        post: '',
        type: '',
        location: '',
        technicalSkills: [],
        softSkills: [],
    }
    if (isFromInferred) {
        const jobDescription = await kv.get<string>('jobDescription') ?? ''
        const inferredJobString = await kv.get<string>('inferredJob') ?? ''
        const inferredJobMatchString = await kv.get<string>('inferredJobMatch') ?? ''

        console.log({inferredJobString, inferredJobMatchString})
        const inferredJob = (typeof inferredJobString === 'object') ? inferredJobString : ((inferredJobString && inferredJobString !== '') ? JSON.parse(inferredJobString) : {})

        const location = inferredJob.inferredDescription.isRemote ? 'Remote' : inferredJob.inferredDescription.location
        jobData.text = jobDescription
        jobData.companyName = inferredJob.inferredDescription.companyName
        jobData.post = inferredJob.inferredDescription.jobTitle
        jobData.type = inferredJob.inferredDescription.type
        jobData.technicalSkills = inferredJob.inferredDescription.technicalSkills
        jobData.softSkills = inferredJob.inferredDescription.softSkills
        jobData.location = location
    }

    // const addJobFunction = addJob.bind(null, jobData)

    return (
        <>
            <h1 className='text-4xl font-bold text-center'>
                Add Job
            </h1>
            <form action={addJob} className="space-y-4 p-4 max-w-lg mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4">


                <div>
                    <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Job Description</label>
                    <textarea id="text" name="text" defaultValue={jobData.text} className="mt-1 block w-full py-2 px-3  border border-gray-300 dark:border-gray-700 dark:bg-black focus:ring-indigo-500 focus:border-indigo-500  bg-white rounded-md shadow-sm focus:outline-none  sm:text-sm" />
                </div>

                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Job URL</label>
                    <input type="text" id="url" name="url" defaultValue={jobData.url} className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 dark:bg-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Company Name</label>
                    <input type="text" id="companyName" name="companyName" defaultValue={jobData.companyName} className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 dark:bg-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <div>
                    <label htmlFor="post" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Job Post</label>
                    <input type="text" id="post" name="post" defaultValue={jobData.post} className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 dark:bg-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Job Type</label>
                    <input type="text" id="type" name="type" defaultValue={jobData.type} className="mt-1 block w-full py-2 px-3  border border-gray-300 dark:border-gray-700 dark:bg-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Technical Skills</label>
                    <input type="text" id="technicalSkills" name="technicalSkills" defaultValue={jobData.technicalSkills.join(", ")} className="mt-1 block w-full py-2 px-3  border border-gray-300 dark:border-gray-700 dark:bg-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Soft Skills</label>
                    <input type="text" id="softSkills" name="softSkills" defaultValue={jobData.softSkills.join(", ")} className="mt-1 block w-full py-2 px-3  border border-gray-300 dark:border-gray-700 dark:bg-black bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>


                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Location</label>
                    <input type="text" id="location" name="location" defaultValue={jobData.location} className="mt-1 block w-full py-2 px-3  border border-gray-300 dark:border-gray-700 dark:bg-black  bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add Job
                </button>
            </form>
        </>
    )
}