'use server'
import {revalidatePath} from "next/cache"
import {redirect} from "next/navigation"
import kv from '@vercel/kv'

export async function inferJob(formData: FormData): Promise<any> {

    const jobDescription = formData.get('jobDescription')?.toString()
    console.log('handleInferJob')
    console.log(jobDescription)
    if (!jobDescription || jobDescription === '') {
        return {error: 'Job description is empty'}
    }
    const jobDescriptionFromCookie = await kv.get('jobDescription')
    console.log({jobDescriptionFromCookie})
    if (jobDescriptionFromCookie !== jobDescription) {
        console.log('Job description from cookie is different from the one in form, Need to re infer the job match')
        await kv.unlink('inferredJobMatch')
    }
    await kv.set('jobDescription', jobDescription)
    const response = await fetch(`${process.env.BACKEND_API_HOST}/jobs/infer`, {
        method: 'POST',
        body: JSON.stringify({description: jobDescription}),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    console.log(data)
    await kv.set('inferredJob', JSON.stringify(data))

    revalidatePath('/inferredData')
    redirect('/inferredData')
}

export async function inferJobMatch(formData: FormData): Promise<any> {

    const jobDescription = formData.get('jobDescription')?.toString()
    console.log('handleInferJobMatch')
    console.log(jobDescription)

    if (!jobDescription || jobDescription === '') {
        return {error: 'Job description is empty'}
    }
    const jobDescriptionFromCookie = await kv.get('jobDescription')
    if (jobDescriptionFromCookie !== jobDescription) {
        console.log('Job description from cookie is different from the one in form, Need to re infer the job')
        await kv.unlink('inferredJob')
    }
    await kv.set('jobDescription', jobDescription)
    const response = await fetch(`${process.env.BACKEND_API_HOST}/jobs/infer-match`, {
        method: 'POST',
        body: JSON.stringify({description: jobDescription}),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    console.log(data)
    await kv.set('inferredJobMatch', JSON.stringify(data))
    revalidatePath('/inferredData')
    redirect('/inferredData')
}