import {AtSymbolIcon, DevicePhoneMobileIcon, GlobeAltIcon} from "@heroicons/react/20/solid"
import {Resume} from "./data/mainResume"
import {Link} from "react-router-dom"
import {CopyButton} from "./buttons"

export default function ResumeComponent({resume}: {resume: Resume}) {
    return (
        <>
            <header className="text-center">
                <h1 className="text-4xl font-bold dark:text-white">{resume.contactDetails.name}</h1>
                <p>
                    <AtSymbolIcon className="inline-block h-5 w-5 me-1" />
                    {resume.contactDetails.email}
                    <DevicePhoneMobileIcon className="inline-block h-5 w-5 ms-1 me-1" />
                    {resume.contactDetails.phone}
                </p>
                <p>
                    <GlobeAltIcon className="inline-block h-5 w-5 me-1" />
                    <Link target="_blank" to={resume.contactDetails.website}>{resume.contactDetails.website}</Link>
                </p>
                <p>
                    <Link target="_blank" className="me-1 ms-1" to={resume.contactDetails.github}>Github</Link> <CopyButton text={resume.contactDetails.github} />
                    <Link target="_blank" to={resume.contactDetails.linkedin}>LinkedIn</Link> <CopyButton text={resume.contactDetails.linkedin} />
                </p>
            </header>
            <section className="mt-4">
                <h2><strong>About</strong></h2>
                <p>{resume.about.summary}</p>
                <h3><strong>Highlights</strong></h3>
                <ul>
                    {resume.about.highlights.map((highlight: string, index: number) => (
                        <li key={index}>- {highlight}</li>
                    ))}
                </ul>
            </section>
            <section className="mt-4">
                <h2><strong>Skills</strong></h2>
                {resume.skills.map((skill: {name: string; items: string[]}, index: number) => (
                    <div key={index}>
                        <strong>{skill.name}</strong>: {skill.items.join(", ")}
                    </div>
                ))}
            </section>
            <section className="mt-4">
                <h2><strong>Certifications</strong></h2>
                <ul>
                    {resume.certifications.map((certification: string, index: number) => (
                        <li key={index}>{certification}</li>
                    ))}
                </ul>
            </section>
            <section className="mt-4">
                <h2><strong>Education</strong></h2>
                {resume.education.map((education: {degree: string; institution: string; location: string; duration: string}, index: number) => (
                    <div key={index}>
                        <h3>{education.degree}</h3>
                        <p className="text-sm text-slate-400">{education.duration}</p>
                        <p>{education.institution}, {education.location}</p>
                    </div>
                ))}
            </section>
            <section className="mt-4">
                <h2><strong>Work Experience</strong></h2>
                {resume.workExperience.map((experience: {company: string; role: string; duration: string; responsibilities: string[]}, index: number) => (
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
                {resume.projects.map((project: {name: string, duration: string, description: string, techStack?: string[], responsibilities?: string[], url?: string}, index: number) => (
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
        </>
    )
}