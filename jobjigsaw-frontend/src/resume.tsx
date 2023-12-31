import {AtSymbolIcon, CheckIcon, DevicePhoneMobileIcon, GlobeAltIcon, PencilIcon} from "@heroicons/react/20/solid"
import {Resume} from "./data/mainResume"
import {Link} from "react-router-dom"
import {CopyButton} from "./buttons"
import clsx from "clsx"
import {useEffect, useState} from "react"

export default function ResumeComponent({initialResume, onResumeUpdated}: {initialResume: Resume, onResumeUpdated?: (resume: Resume) => void}) {
    const [resume, setResume] = useState<Resume>(initialResume)
    console.log(resume)

    const [isEditingSkills, setIsEditingSkills] = useState<boolean>(false)
    const [isEditingWorkExperience, setIsEditingWorkExperience] = useState<boolean>(false)
    const [isEditingProjects, setIsEditingProjects] = useState<boolean>(false)
    const isLoading = resume.contactDetails.name === ""
    // Update local state when prop changes
    useEffect(() => {
        setResume(initialResume)
    }, [initialResume])

    function handleSkillChange(index: number, newSkillItems: string[]) {
        setResume(prevResume => {
            const newResume = {...prevResume}
            newResume.skills[index].items = newSkillItems
            return newResume
        })
    }


    function handleResumeChange() {
        if (onResumeUpdated) {
            onResumeUpdated(resume)
        }

    }

    function handleEditingToggle() {
        setIsEditingSkills(!isEditingSkills)
        handleResumeChange()
    }

    function handleWorkExperienceEditingToggle() {
        setIsEditingWorkExperience(!isEditingWorkExperience)
        handleResumeChange()
    }

    function handleProjectsEditingToggle() {
        setIsEditingProjects(!isEditingProjects)
        handleResumeChange()
    }
    return (
        <>
            <header className={clsx("text-center", {"animate-pulse": isLoading})}>
                <h1 className={clsx("text-4xl font-bold dark:text-white", {"animate-pulse": isLoading})}>{resume.contactDetails.name}</h1>
                <p>
                    <AtSymbolIcon className={clsx("inline-block h-5 w-5 me-1", {"animate-pulse": isLoading})} />
                    {resume.contactDetails.email}
                    <DevicePhoneMobileIcon className={clsx("inline-block h-5 w-5 ms-1 me-1", {"animate-pulse": isLoading})} />
                    {resume.contactDetails.phone}
                </p>
                <p>
                    <GlobeAltIcon className={clsx("inline-block h-5 w-5 me-1", {"animate-pulse": isLoading})} />
                    <Link target="_blank" to={resume.contactDetails.website}>{resume.contactDetails.website}</Link>
                </p>
                <p>
                    <Link target="_blank" className={clsx("me-1 ms-1", {"animate-pulse": isLoading})} to={resume.contactDetails.github}>Github</Link> <CopyButton text={resume.contactDetails.github} />
                    <Link target="_blank" to={resume.contactDetails.linkedin}>LinkedIn</Link> <CopyButton text={resume.contactDetails.linkedin} />
                </p>
            </header>
            <section className={clsx("mt-4", {"animate-pulse": isLoading})}>
                <h2><strong>About</strong></h2>
                <p>{resume.about.summary}</p>
                <h3><strong>Highlights</strong></h3>
                <ul>
                    {resume.about.highlights.map((highlight: string, index: number) => (
                        <li key={index}>- {highlight}</li>
                    ))}
                </ul>
            </section>
            <section className={clsx("mt-4", {"animate-pulse": isLoading})}>
                <h2><strong>Skills</strong>
                    <button className=" p-2 rounded-md" onClick={handleEditingToggle}>
                        {
                            isEditingSkills ?
                                <CheckIcon className="w-3 h-3" /> : <PencilIcon className="w-3 h-3" />
                        }
                    </button>
                </h2>
                {resume.skills.map((skill: {name: string; items: string[]}, index: number) => (

                    <div key={index}>
                        <strong>{skill.name}</strong>: {isEditingSkills ?
                            <input type="text" className="border border-white p-2 rounded-md" value={skill.items.join(", ")} onChange={(e) => {
                                handleSkillChange(index, e.target.value.split(", "))
                            }} /> :
                            skill.items.join(", ")}
                    </div>
                ))}
            </section>
            <section className={clsx("mt-4", {"animate-pulse": isLoading})}>
                <h2><strong>Certifications</strong></h2>
                <ul>
                    {resume.certifications.map((certification: string, index: number) => (
                        <li key={index}>{certification}</li>
                    ))}
                </ul>
            </section>
            <section className={clsx("mt-4", {"animate-pulse": isLoading})}>
                <h2><strong>Education</strong></h2>
                {resume.education.map((education: {degree: string; institution: string; location: string; duration: string}, index: number) => (
                    <div key={index}>
                        <h3>{education.degree}</h3>
                        <p className={clsx("text-sm text-slate-400", {"animate-pulse": isLoading})}>{education.duration}</p>
                        <p>{education.institution}, {education.location}</p>
                    </div>
                ))}
            </section>
            <section className={clsx("mt-4", {"animate-pulse": isLoading})}>
                <h2><strong>Work Experience</strong>
                    <button className=" p-2 rounded-md" onClick={handleWorkExperienceEditingToggle}>
                        {
                            isEditingWorkExperience ?
                                <CheckIcon className="w-3 h-3" /> : <PencilIcon className="w-3 h-3" />
                        }
                    </button></h2>
                {resume.workExperience.map((experience: {company: string; role: string; duration: string; responsibilities: string[]}, index: number) => (
                    <div key={index} className={clsx("mb-4", {"animate-pulse": isLoading})}>
                        <h3><strong>Company: </strong>{experience.company}</h3>
                        <p><strong>Role: </strong>{experience.role}</p>
                        <p className={clsx("text-sm text-slate-400", {"animate-pulse": isLoading})} >
                            {experience.duration}
                        </p>
                        <ul>
                            {experience.responsibilities.map((responsibility, index) => (
                                <li key={index}>{responsibility}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
            <section className={clsx("mt-4", {"animate-pulse": isLoading})}>
                <h2><strong>Projects</strong>
                    <button className=" p-2 rounded-md" onClick={handleProjectsEditingToggle}>
                        {
                            isEditingProjects ?
                                <CheckIcon className="w-3 h-3" /> : <PencilIcon className="w-3 h-3" />
                        }
                    </button></h2>
                {resume.projects.map((project: {name: string, duration: string, description: string, techStack?: string[], responsibilities?: string[], url?: string}, index: number) => (
                    <div key={index} className={clsx("mb-4", {"animate-pulse": isLoading})}>
                        <h3><strong>{project.name}</strong></h3>
                        <p className={clsx("text-sm text-slate-400", {"animate-pulse": isLoading})}>{
                            isEditingProjects ?
                                <input type="text" className="border border-white p-2 rounded-md" value={project.duration} onChange={(e) => {
                                    setResume(prevResume => {
                                        const newResume = {...prevResume}
                                        newResume.projects[index].duration = e.target.value
                                        return newResume
                                    })
                                }} /> :

                                project.duration}</p>
                        <p>{
                            isEditingProjects ? <textarea className="border border-white p-2 rounded-md" value={project.description} onChange={(e) => {
                                setResume(prevResume => {
                                    const newResume = {...prevResume}
                                    newResume.projects[index].description = e.target.value
                                    return newResume
                                })
                            }
                            } /> :
                                project.description}</p>
                        <p><strong>Tech Stack: </strong>{
                            isEditingProjects ?
                                <input type="text" className="border border-white p-2 rounded-md" value={project.techStack?.join(", ")} onChange={(e) => {
                                    setResume(prevResume => {
                                        const newResume = {...prevResume}
                                        newResume.projects[index].techStack = e.target.value.split(", ")
                                        return newResume
                                    })
                                }} /> :

                                project.techStack?.join(", ")}</p>

                        {
                            isEditingProjects ?
                                <input type="text" className="border border-white p-2 rounded-md" value={project.responsibilities?.join(", ")} onChange={(e) => {
                                    setResume(prevResume => {
                                        const newResume = {...prevResume}
                                        newResume.projects[index].url = e.target.value
                                        return newResume
                                    })
                                }} /> :

                                project.url && <p><strong>URL: </strong><Link target="_blank" to={project.url} >{project.url}</Link></p>}
                        {
                            isEditingProjects ?
                                <input type="text" className="border border-white p-2 rounded-md" value={project.responsibilities?.join(", ")} onChange={(e) => {
                                    setResume(prevResume => {
                                        const newResume = {...prevResume}
                                        newResume.projects[index].responsibilities = e.target.value.split(", ")
                                        return newResume
                                    })
                                }} /> :

                                project.responsibilities &&
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