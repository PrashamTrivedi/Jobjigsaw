/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import {ResumeResponse, getMainResume} from "./mainResume"

export async function getResumeById(id: string): Promise<ResumeResponse> {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_HOST}/resumes/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export async function getResumes(): Promise<ResumeResponse[]> {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_HOST}/resumes`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export async function updateResumeById(id: string, body: {updatedResume: any, technicalSkills: string, softSkills: string, coverLetter: string}) {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_API_HOST}/resumes/${id}`, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export async function deleteResumeById(id: string) {
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_API_HOST}/resumes/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export async function createResume(body: {jobId: string, updatedResume: any, technicalSkills: string, softSkills: string, coverLetter: string}) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_HOST}/resumes`, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export async function generateResume(jobCompatibilityData: any, generateCoverLetter: boolean) {
    const costSavingMode = import.meta.env.VITE_COST_SAVING_MODE ?? ""
    const headers: any = {"streaming": "true", 'Content-Type': 'application/json'}


    if (costSavingMode) {
        headers['x-cost-saving-mode'] = 'true'
    }
    const mainResume = await getMainResume()
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_HOST}/resumes/generate`
        , {
            method: 'POST',
            headers,
            body: JSON.stringify({jobCompatibilityData, generateCoverLetter}),
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
    const inferredResume = JSON.parse(chunks.join(''))
    const converLetter = inferredResume.coverLetter
    delete inferredResume.coverLetter
    return {
        resumeDetails: {
            generatedResume: {

                ...mainResume,
                ...JSON.parse(chunks.join('')),
            }, coverLetter: converLetter
        }
    }

}


export async function printResume({resumeId, resumeJson, resumeName}: {resumeId?: string, resumeJson?: any, resumeName: string}) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_HOST}/resumes/printResume`, {resumeId, resumeJson, resumeName}, {
        headers: {
            'Content-Type': 'application/json',
        },
        responseType: 'blob',
    })
    return response.data
}