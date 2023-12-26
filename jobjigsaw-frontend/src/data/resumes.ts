import axios from "axios"
import {ResumeResponse} from "./mainResume"

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
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_HOST}/resumes/generate`, {jobCompatibilityData, generateCoverLetter}, {
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 100000,
        timeoutErrorMessage: 'Resume generation timed out. Please try again.'
    })
    return response.data
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