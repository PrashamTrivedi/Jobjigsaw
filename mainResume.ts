import mainResumeData from './mainResume.json'

interface ContactDetails {
    name: string
    email: string
    phone: string
    website: string
    github: string
    linkedin: string
}

interface About {
    summary: string
    highlights: string[]
}
interface Skills {
    name: string
    items: string[]
}


interface Education {
    degree: string
    institution: string
    location: string
    duration: string
}

interface WorkExperience {
    company: string
    role: string
    duration: string
    responsibilities: string[]
}

interface Project {
    name: string
    duration: string
    description: string
    techStack: string[]
    url?: string
    responsibilities?: string[]
}

interface Resume {

    contactDetails: ContactDetails
    about: About
    skills: Skills[]
    certifications: string[]
    education: Education[]
    workExperience: WorkExperience[]
    projects: Project[]
}

export type {ContactDetails, About, Skills, Education, WorkExperience, Project, Resume}



export const mainResume: Resume = mainResumeData
