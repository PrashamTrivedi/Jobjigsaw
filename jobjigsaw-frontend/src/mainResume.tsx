import {AtSymbolIcon, DevicePhoneMobileIcon, GlobeAltIcon} from "@heroicons/react/20/solid"
import {getMainResume} from "./data/mainResume"
import {Link} from "react-router-dom"
import {CopyButton} from "./buttons"
import MainContent from "./mainContent"
import {Suspense, useEffect, useState} from "react"

interface Resume {

    contactDetails: ContactDetails
    about: About
    skills: Skills[]
    certifications: string[]
    education: Education[]
    workExperience: WorkExperience[]
    projects: Project[]
}

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

export default function MainResume() {

    const [mainResume, setMainResume] = useState<Resume>({
        about: {
            summary: "",
            highlights: []
        },
        certifications: [],
        contactDetails: {
            name: "",
            email: "",
            phone: "",
            website: "",
            github: "",
            linkedin: ""
        },
        education: [],
        projects: [],
        skills: [],
        workExperience: []
    })

    useEffect(() => {
        // console.log("Calling API")
        (async () => {
            const mainResume = await getMainResume()
            console.log(`mainResume: ${JSON.stringify(mainResume)}`)
            setMainResume(mainResume)
        })()
        
    }, [])
    return (

        <MainContent>
            <Suspense fallback={<div>Loading...</div>}>

                <header className="text-center">
                    <h1 className="text-4xl font-bold dark:text-white">{mainResume.contactDetails.name}</h1>
                    <p>
                        <AtSymbolIcon className="inline-block h-5 w-5 me-1" />
                        {mainResume.contactDetails.email}
                        <DevicePhoneMobileIcon className="inline-block h-5 w-5 ms-1 me-1" />
                        {mainResume.contactDetails.phone}
                    </p>
                    <p>
                        <GlobeAltIcon className="inline-block h-5 w-5 me-1" />
                        <Link target="_blank" to={mainResume.contactDetails.website}>{mainResume.contactDetails.website}</Link>
                    </p>
                    <p>
                        <Link target="_blank" className="me-1 ms-1" to={mainResume.contactDetails.github}>Github</Link> <CopyButton text={mainResume.contactDetails.github} />
                        <Link target="_blank" to={mainResume.contactDetails.linkedin}>LinkedIn</Link> <CopyButton text={mainResume.contactDetails.linkedin} />
                    </p>
                </header>
                <section className="mt-4">
                    <h2><strong>About</strong></h2>
                    <p>{mainResume.about.summary}</p>
                    <h3><strong>Highlights</strong></h3>
                    <ul>
                        {mainResume.about.highlights.map((highlight: string, index: number) => (
                            <li key={index}>- {highlight}</li>
                        ))}
                    </ul>
                </section>
                <section className="mt-4">
                    <h2><strong>Skills</strong></h2>
                    {mainResume.skills.map((skill: {name: string; items: string[]}, index: number) => (
                        <div key={index}>
                            <strong>{skill.name}</strong>: {skill.items.join(", ")}
                        </div>
                    ))}
                </section>
                <section className="mt-4">
                    <h2><strong>Certifications</strong></h2>
                    <ul>
                        {mainResume.certifications.map((certification: string, index: number) => (
                            <li key={index}>{certification}</li>
                        ))}
                    </ul>
                </section>
                <section className="mt-4">
                    <h2><strong>Education</strong></h2>
                    {mainResume.education.map((education: {degree: string; institution: string; location: string; duration: string}, index: number) => (
                        <div key={index}>
                            <h3>{education.degree}</h3>
                            <p className="text-sm text-slate-400">{education.duration}</p>
                            <p>{education.institution}, {education.location}</p>
                        </div>
                    ))}
                </section>
                <section className="mt-4">
                    <h2><strong>Work Experience</strong></h2>
                    {mainResume.workExperience.map((experience: {company: string; role: string; duration: string; responsibilities: string[]}, index: number) => (
                        <div key={index} className="mb-4">
                            <h3><strong>Company: </strong>{experience.company}</h3>
                            <p><strong>Role: </strong>{experience.role}</p>
                            <p className="text-sm text-slate-400" >{experience.duration}</p>
                            <ul>
                                {experience.responsibilities.map((responsibility, index) => (
                                    <li key={index}>{responsibility}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
                <section className="mt-4">
                    <h2><strong>Projects</strong></h2>
                    {mainResume.projects.map((project: {name: string, duration: string, description: string, techStack?: string[], responsibilities?: string[], url?: string}, index: number) => (
                        <div key={index} className="mb-4">
                            <h3><strong>{project.name}</strong></h3>
                            <p className="text-sm text-slate-400">{project.duration}</p>
                            <p>{project.description}</p>
                            <p><strong>Tech Stack: </strong>{project.techStack?.join(", ")}</p>

                            {project.url && <p><strong>URL: </strong><Link target="_blank" to={project.url} >{project.url}</Link></p>}
                            {project.responsibilities &&
                                <>
                                    <strong>Responsibilities:</strong>
                                    <ul>
                                        {project.responsibilities?.map((responsibility: string, index: number) => (
                                            <li key={index}>{responsibility}</li>
                                        ))}
                                    </ul>
                                </>
                            }
                        </div>
                    ))}
                </section>
            </Suspense>
        </MainContent>
    )
}