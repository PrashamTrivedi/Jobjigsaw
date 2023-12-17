'use server'
import {kv} from "@vercel/kv"
import {revalidatePath} from "next/cache"
import {redirect} from "next/navigation"

/**
 * {
  "text": "string",
  "url": "string",
  "companyName": "string",
  "post": "string",
  "type": "string",
  "location": "string",
  "date": "string"
}
 */
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

export async function addJob(formData: FormData) {
    const job: Job = {
        text: formData.get('text') as string,
        url: formData.get('url') as string,
        companyName: formData.get('companyName') as string,
        post: formData.get('post') as string,
        type: formData.get('type') as string,
        location: formData.get('location') as string,
        technicalSkills: formData.getAll('technicalSkills') as string[],
        softSkills: formData.getAll('softSkills') as string[],
        inferredJob: formData.get('inferredJob') as string,
        inferredJobMatch: formData.get('inferredJobMatch') as string,
    }

    console.log(job)
    const response = await fetch(`${process.env.BACKEND_API_HOST}/jobs`, {
        method: 'POST',
        body: JSON.stringify(job),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    console.log(data)
    kv.del('inferredJob')
    kv.del('inferredJobMatch')
    kv.del('jobDescription')
    revalidatePath('/saved-jobs')
    redirect('/saved-jobs')
}

export async function getJobs() {
    const response = await fetch(`${process.env.BACKEND_API_HOST}/jobs`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    return data
}

export async function getJob(id: string) {
    const response = await fetch(`${process.env.BACKEND_API_HOST}/jobs/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    return data
}

export async function deleteJob(id: string) {
    console.log('deleteJob')
    console.log(id)
    const response = await fetch(`${process.env.BACKEND_API_HOST}/jobs/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    console.log(data)
    revalidatePath('/saved-jobs')
    redirect('/saved-jobs')

}