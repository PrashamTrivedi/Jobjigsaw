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

export async function updateSkills({skills}: {skills: Skills[]}) {

    const response = await axios.put(`${import.meta.env.VITE_BACKEND_API_HOST}/mainResume/updateSkills`, skills, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export async function updateExperience(experience: WorkExperience) {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_API_HOST}/mainResume/addWorkExperience`, experience, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export async function addProject(project: Project) {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_API_HOST}/mainResume/addProject`, project, {
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
