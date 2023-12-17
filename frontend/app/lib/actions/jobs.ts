'use server'
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
    id: number
    text: string
    url: string
    companyName: string
    post: string
    type: string
    location: string
    date: string
}

export async function addJob(job: Job) {
    const response = await fetch(`${process.env.BACKEND_API_HOST}/jobs`, {
        method: 'POST',
        body: JSON.stringify(job),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    console.log(data)
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