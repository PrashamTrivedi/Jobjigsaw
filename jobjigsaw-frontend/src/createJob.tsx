import {useState} from "react"
import {Job, addJob} from "./data/jobs"
import MainContent from "./mainContent"
import './createJob.css'
import {useLocation} from "react-router-dom"


export default function CreateJob() {
    const {state} = useLocation()
    const {jobDescription, inferredJob, inferredJobMatch} = state


    const inferredJobJson = inferredJob
    let parsedJob: Job = {
        text: jobDescription,
        url: '',
        companyName: '',
        post: '',
        type: '',
        location: '',
        technicalSkills: [],
        softSkills: [],
        inferredJob: '',
        inferredJobMatch: ''
    }
    if (jobDescription && jobDescription !== '') {
        const location = (inferredJobJson?.inferredDescription?.isRemote ?? false) ? 'Remote' : inferredJobJson?.inferredDescription?.location

        parsedJob = {
            text: jobDescription,
            url: '',
            companyName: inferredJobJson?.inferredDescription?.companyName,
            post: inferredJobJson?.inferredDescription?.jobTitle,
            type: inferredJobJson?.inferredDescription?.type,
            location,
            technicalSkills: inferredJobJson?.inferredDescription?.technicalSkills ?? [],
            softSkills: inferredJobJson?.inferredDescription?.softSkills ?? [],
            inferredJob: JSON.stringify(inferredJob),
            inferredJobMatch: JSON.stringify(inferredJobMatch)
        }

    }
    const [job, setJob] = useState(parsedJob)
    const [isAdding, setIsAdding] = useState(false)

    async function handleAddJob() {
        setIsAdding(true)
        const data = await addJob(job)
        console.log({data})
        setIsAdding(false)
        window.location.href = '/saved-jobs'
    }

    return (
        <MainContent>
            <h1 className='text-4xl font-bold text-center'>
                Add Job
            </h1>
            <div className="space-y-4 p-4 max-w-lg mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4">


                <div>
                    <label htmlFor="text"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200">Job Description</label>
                    <textarea id="text" disabled
                        rows={30}

                        name="text"
                        value={job.text}
                        onChange={(e) => setJob({...job, text: e.target.value})}
                        className="inputBox" />
                </div>

                <div>
                    <label htmlFor="url"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200">Job URL</label>
                    <input type="text"
                        id="url" name="url"
                        value={job.url}
                        onChange={(e) => setJob({...job, url: e.target.value})}
                        className="inputBox" />
                </div>

                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Company Name</label>
                    <input type="text"
                        id="companyName" name="companyName"
                        value={job.companyName}
                        onChange={(e) => setJob({...job, companyName: e.target.value})}
                        className="inputBox" />
                </div>

                <div>
                    <label htmlFor="post" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Job Post</label>
                    <input type="text"
                        id="post" name="post"
                        value={job.post}
                        onChange={(e) => setJob({...job, post: e.target.value})}
                        className="inputBox" />
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Job Type</label>
                    <input type="text" id="type" name="type"
                        value={job.type}
                        onChange={(e) => setJob({...job, type: e.target.value})}
                        className="inputBox" />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Technical Skills</label>
                    <input type="text"
                        id="technicalSkills" name="technicalSkills"
                        value={job.technicalSkills.join(", ")}
                        onChange={(e) => setJob({...job, technicalSkills: e.target.value.split(", ")})}
                        className="inputBox" />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Soft Skills</label>
                    <input type="text"
                        id="softSkills" name="softSkills"
                        value={job.softSkills.join(", ")}
                        onChange={(e) => setJob({...job, softSkills: e.target.value.split(", ")})}
                        className="inputBox" />
                </div>


                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Location</label>
                    <input type="text"
                        id="location" name="location"
                        value={job.location}
                        onChange={(e) => setJob({...job, location: e.target.value})}
                        className="inputBox" />
                </div>


                <button onClick={handleAddJob}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {isAdding ? 'Adding Job...' : 'Add Job'}
                </button>
            </div>

        </MainContent>
    )
}