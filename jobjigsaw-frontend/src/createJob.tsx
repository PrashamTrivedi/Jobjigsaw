import {useState} from "react"
import {Job} from "./data/jobs"
import MainContent from "./mainContent"
import './createJob.css'

export default function CreateJob({jobDescription, inferredJob, inferredJobMatch}: {jobDescription?: string, inferredJob?: string, inferredJobMatch?: string}) {


    const jobData: Job = {
        text: '',
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
    const [job, setJob] = useState(jobData)
    const inferredJobJson = (typeof inferredJob === 'object') ? inferredJob : ((inferredJob && inferredJob !== '') ? JSON.parse(inferredJob) : {})

    if (jobDescription && jobDescription !== '') {
        const location = inferredJobJson.inferredDescription.isRemote ? 'Remote' : inferredJobJson.inferredDescription.location

        jobData.text = jobDescription
        jobData.companyName = inferredJobJson.inferredDescription.companyName
        jobData.post = inferredJobJson.inferredDescription.jobTitle
        jobData.type = inferredJobJson.inferredDescription.type
        jobData.technicalSkills = inferredJobJson.inferredDescription.technicalSkills
        jobData.softSkills = inferredJobJson.inferredDescription.softSkills
        jobData.location = location
        jobData.inferredJob = inferredJob
        jobData.inferredJobMatch = inferredJobMatch
        setJob(jobData)
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
                    <textarea id="text"
                        name="text"
                        value={jobData.text}
                        onChange={(e) => setJob({...job, text: e.target.value})}
                        className="inputBox" />
                </div>

                <div>
                    <label htmlFor="url"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200">Job URL</label>
                    <input type="text"
                        id="url" name="url"
                        value={jobData.url}
                        onChange={(e) => setJob({...job, url: e.target.value})}
                        className="inputBox" />
                </div>

                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Company Name</label>
                    <input type="text"
                        id="companyName" name="companyName"
                        value={jobData.companyName}
                        onChange={(e) => setJob({...job, companyName: e.target.value})}
                        className="inputBox" />
                </div>

                <div>
                    <label htmlFor="post" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Job Post</label>
                    <input type="text"
                        id="post" name="post"
                        value={jobData.post}
                        onChange={(e) => setJob({...job, post: e.target.value})}
                        className="inputBox" />
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Job Type</label>
                    <input type="text" id="type" name="type"
                        value={jobData.type}
                        onChange={(e) => setJob({...job, type: e.target.value})}
                        className="inputBox" />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Technical Skills</label>
                    <input type="text"
                        id="technicalSkills" name="technicalSkills"
                        value={jobData.technicalSkills.join(", ")}
                        onChange={(e) => setJob({...job, technicalSkills: e.target.value.split(", ")})}
                        className="inputBox" />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Soft Skills</label>
                    <input type="text"
                        id="softSkills" name="softSkills"
                        value={jobData.softSkills.join(", ")}
                        onChange={(e) => setJob({...job, softSkills: e.target.value.split(", ")})}
                        className="inputBox" />
                </div>


                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Location</label>
                    <input type="text"
                        id="location" name="location"
                        value={jobData.location}
                        onChange={(e) => setJob({...job, location: e.target.value})}
                        className="inputBox" />
                </div>


                <button onClick={() => {
                }
                }
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add Job
                </button>
            </div>

        </MainContent>
    )
}