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
    const response = await axios.post(`${process.env.BACKEND_API_HOST}/jobs`, job)
    console.log(response.data)
}

export async function getJobs() {
    const response = await axios.get(`${process.env.BACKEND_API_HOST}/jobs`)
    return response.data
}

export async function getJob(id: string) {
    const response = await axios.get(`${process.env.BACKEND_API_HOST}/jobs/${id}`)
    return response.data
}

export async function deleteJob(id: string) {
    console.log('deleteJob')
    console.log(id)
    const response = await axios.delete(`${process.env.BACKEND_API_HOST}/jobs/${id}`)
    console.log(response.data)
}