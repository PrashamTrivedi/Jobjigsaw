'use server'
import {revalidatePath} from "next/cache"
import {redirect} from "next/navigation"
import {cookies} from 'next/headers'
export async function inferJob(formData: FormData): Promise<any> {
    const jobDescription = formData.get('jobDescription')?.toString()
    console.log('handleInferJob')
    console.log(jobDescription)
    console.log(process.env.BACKEND_API_HOST)
    if (!jobDescription) {
        return {error: 'Job description is empty'}
    }
    cookies().set('jobDescription', jobDescription)
    const response = await fetch(`${process.env.BACKEND_API_HOST}/jobs/infer`, {
        method: 'POST',
        body: JSON.stringify({description: jobDescription}),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    console.log(data)
    cookies().set('inferredJob', JSON.stringify(data))
    revalidatePath('/inferredData')
    redirect('/inferredData')
}

export async function inferJobMatch(formData: FormData): Promise<any> {
    const jobDescription = formData.get('jobDescription')
    console.log('handleInferJobMatch')
    console.log(jobDescription)
    if (!jobDescription) {
        return {error: 'Job description is empty'}
    }
    const response = await fetch(`${process.env.BACKEND_API_HOST}/jobs/infer-match`, {
        method: 'POST',
        body: JSON.stringify({description: jobDescription}),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    console.log(data)
    cookies().set('inferredJobMatch', JSON.stringify(data))
    revalidatePath('/inferredData')
    redirect('/inferredData')
}