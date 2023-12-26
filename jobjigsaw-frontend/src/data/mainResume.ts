import axios from 'axios'

export async function getMainResume() {
    console.log(`${import.meta.env.VITE_BACKEND_API_HOST}/mainResume/getMainResume`)
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_HOST}/mainResume/getMainResume`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export async function updateSkills({name, items}: {name: string, items: string[]}) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_HOST}/mainResume/updateSkills`, {name, items}, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export async function updateExperience(body: {company: string, role: string, duration: string, responsibilities: string[]}) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_HOST}/mainResume/addWorkExperience`, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export async function addProject(body: {name: string, description: string, url: string, techStack: string[], responsibilities: string[]}) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_HOST}/mainResume/addProject`, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}


export interface Resume {

    contactDetails: ContactDetails
    about: About
    skills: Skills[]
    certifications: string[]
    education: Education[]
    workExperience: WorkExperience[]
    projects: Project[]
}

export interface ContactDetails {
    name: string
    email: string
    phone: string
    website: string
    github: string
    linkedin: string
}

export interface About {
    summary: string
    highlights: string[]
}
export interface Skills {
    name: string
    items: string[]
}


export interface Education {
    degree: string
    institution: string
    location: string
    duration: string
}

export interface WorkExperience {
    company: string
    role: string
    duration: string
    responsibilities: string[]
}

export interface Project {
    name: string
    duration: string
    description: string
    techStack: string[]
    url?: string
    responsibilities?: string[]
}

export interface ResumeResponse extends Resume {
    id: string
    cover_letter: string
    job_id: string
    soft_skills: string
    technical_skills: string
    updated_resume: string
}
