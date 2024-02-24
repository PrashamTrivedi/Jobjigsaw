/* eslint-disable @typescript-eslint/no-explicit-any */


export async function inferJob(jobDescription: string): Promise<any> {

    console.log('handleInferJob')
    console.log(jobDescription)
    if (!jobDescription || jobDescription === '') {
        return {error: 'Job description is empty'}
    }
    const costSavingMode = import.meta.env.VITE_COST_SAVING_MODE ?? ""
    const headers: any = {"streaming": "true", 'Content-Type': 'application/json'}


    if (costSavingMode) {
        headers['x-cost-saving-mode'] = 'true'
    }

    
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_HOST}/jobs/infer`, {
        method: 'POST',
        headers,
        body: JSON.stringify({description: jobDescription})
    })

    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()
    const chunks = []
    if (reader) {

        let value, done
        while (!done) {
            const data = await reader.read()
            value = data.value?.toString()
            done = data.done
            console.log(value)
            chunks.push(value)
        }

    }



    console.log('stream end')
    console.log({data: chunks.join('')})
    return {inferredDescription: JSON.parse(chunks.join(''))}

}

export async function researchCompany(search: string, chunkUpdater: (chunkData: string) => void, onStreamEnd: () => void): Promise<any> {

    console.log('handleResearchCompany')
    console.log(search)
    if (!search || search === '') {
        return {error: 'Search is empty'}
    }
    const costSavingMode = import.meta.env.VITE_COST_SAVING_MODE ?? ""
    const headers: any = {"streaming": "true", 'Content-Type': 'application/json'}

    if (costSavingMode) {
        headers['x-cost-saving-mode'] = 'true'
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_HOST}/jobs/research-company/${search}`, {
        method: 'GET',
        headers,
    })

    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()

    // const chunks = []

    if (reader) {

        let value, done
        while (!done) {
            const data = await reader.read()
            value = data.value?.toString()
            done = data.done
            console.log(value)
            // chunks.push(value)
            value && chunkUpdater(value)
        }

    }
    console.log('stream end')
    onStreamEnd()
}

export async function inferJobMatch(jobDescription: string): Promise<any> {

    console.log('handleInferJobMatch')
    console.log(jobDescription)

    if (!jobDescription || jobDescription === '') {
        return {error: 'Job description is empty'}
    }

    const costSavingMode = import.meta.env.VITE_COST_SAVING_MODE ?? ""
    const headers: any = {"streaming": "true", 'Content-Type': 'application/json'}


    if (costSavingMode) {
        headers['x-cost-saving-mode'] = 'true'
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_HOST}/jobs/infer-match`, {
        method: 'POST',
        headers,
        body: JSON.stringify({description: jobDescription})
    })

    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()
    const chunks = []
    if (reader) {

        let value, done
        while (!done) {
            const data = await reader.read()
            value = data.value?.toString()
            done = data.done
            console.log(value)
            chunks.push(value)
        }

    }



    console.log('stream end')
    console.log({data: chunks.join('')})
    return {compatibilityMatrix: JSON.parse(chunks.join(''))}
}