import axios from 'axios'

export interface Job {
    id?: number
    text: string
    url: string
    companyName: string
    post: string
    type: string
    location: string
    date?: string
    technicalSkills: string[]
    softSkills: string[]
    inferredJob?: string
    inferredJobMatch?: string
}

export async function addJob(job: Job) {
    console.log(job)
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_HOST}/jobs`, job)
    console.log(response.data)
}

export async function getJobs(): Promise<Job[]> {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_HOST}/jobs`)
    return response.data
}

export async function getJob(id: string): Promise<Job> {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_HOST}/jobs/${id}`)
    return response.data
}

export async function deleteJob(id: string) {
    console.log('deleteJob')
    console.log(id)
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_API_HOST}/jobs/${id}`)
    console.log(response.data)
}