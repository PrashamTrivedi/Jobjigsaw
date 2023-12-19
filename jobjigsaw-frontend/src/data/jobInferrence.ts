import axios from 'axios';

export async function inferJob(jobDescription: string): Promise<any> {

    console.log('handleInferJob')
    console.log(jobDescription)
    if (!jobDescription || jobDescription === '') {
        return {error: 'Job description is empty'}
    }

    const response = await axios.post(`${process.env.BACKEND_API_HOST}/jobs/infer`, {
        description: jobDescription
    })
    const data = response.data
    console.log(data)

}

export async function inferJobMatch(jobDescription: string): Promise<any> {

    console.log('handleInferJobMatch')
    console.log(jobDescription)

    if (!jobDescription || jobDescription === '') {
        return {error: 'Job description is empty'}
    }

    const response = await axios.post(`${process.env.BACKEND_API_HOST}/jobs/infer-match`, {
        description: jobDescription
    })
    const data = response.data
    console.log(data)
    // await kv.set('inferredJobMatch', JSON.stringify(data), {ex: 60})
    // revalidatePath('/inferredData')
    // redirect('/inferredData')
}