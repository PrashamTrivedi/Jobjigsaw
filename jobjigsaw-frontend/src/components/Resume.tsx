'use client'

import { AtSymbolIcon, CheckIcon, DevicePhoneMobileIcon, GlobeAltIcon, LinkIcon, PencilIcon } from "@heroicons/react/20/solid";
import { Resume } from "@/data/mainResume";
import Link from "next/link";
import { CopyButton } from "./buttons";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function ResumeComponent({ initialResume, onResumeUpdated }: { initialResume: Resume; onResumeUpdated?: (resume: Resume) => void }) {
    const [resume, setResume] = useState<Resume>(initialResume);
    console.log(resume);

    const [isEditingSkills, setIsEditingSkills] = useState<boolean>(false);
    const [isEditingWorkExperience, setIsEditingWorkExperience] = useState<boolean>(false);
    const [isEditingProjects, setIsEditingProjects] = useState<boolean>(false);

    // const newWorkExperience = {
    //     company: "",
    //     role: "",
    //     duration: "",
    //     responsibilities: []
    // }
    const isLoading = !resume.basics.name;
    // Update local state when prop changes
    useEffect(() => {
        setResume(initialResume);
    }, [initialResume]);

    function handleSkillChange(index: number, newSkillItems: string[]) {
        setResume((prevResume) => {
            const newResume = { ...prevResume };
            newResume.skills[index].keywords = newSkillItems;
            return newResume;
        });
    }

    function handleResumeChange() {
        if (onResumeUpdated) {
            onResumeUpdated(resume);
        }
    }

    function handleEditingToggle() {
        setIsEditingSkills(!isEditingSkills);
        handleResumeChange();
    }

    function handleWorkExperienceEditingToggle() {
        setIsEditingWorkExperience(!isEditingWorkExperience);
        handleResumeChange();
    }

    function handleProjectsEditingToggle() {
        setIsEditingProjects(!isEditingProjects);
        handleResumeChange();
    }
    return (
        <>
            <header className={clsx("text-center", { "animate-pulse": isLoading })}>
                <h1 className={clsx("text-4xl font-bold dark:text-white", { "animate-pulse": isLoading })}>{resume.basics.name}</h1>
                <p>
                    <AtSymbolIcon className={clsx("inline-block h-5 w-5 me-1", { "animate-pulse": isLoading })} />
                    {resume.basics.email}
                    <DevicePhoneMobileIcon className={clsx("inline-block h-5 w-5 ms-1 me-1", { "animate-pulse": isLoading })} />
                    {resume.basics.phone}
                </p>
                <p>
                    <GlobeAltIcon className={clsx("inline-block h-5 w-5 me-1", { "animate-pulse": isLoading })} />
                    <Link target="_blank" href={resume.basics.url || ''}>{resume.basics.url}</Link>
                </p>
                <p>
                    {resume.basics.profiles.map((profile, index) => (
                        <>
                            <Link target="_blank" className={clsx("me-1 ms-1", { "animate-pulse": isLoading })} href={profile.url}>{profile.network}</Link>
                            <CopyButton text={profile.url} />
                        </>
                    ))}
                </p>
            </header>
            <section className={clsx("mt-4", { "animate-pulse": isLoading })}>
                <h2><strong>About</strong></h2>
                <p>{resume.basics.summary}</p>
            </section>
            <section className={clsx("mt-4", { "animate-pulse": isLoading })}>
                <h2><strong>Skills</strong>
                    <button className=" p-2 rounded-md" onClick={handleEditingToggle}>
                        {
                            isEditingSkills ?
                                <CheckIcon className="w-3 h-3" /> : <PencilIcon className="w-3 h-3" />
                        }
                    </button>
                </h2>
                {resume.skills.map((skill, index) => (
                    <div key={index}>
                        <strong>{skill.name}</strong>: {isEditingSkills ?
                            <input type="text" className="border border-white p-2 rounded-md" value={skill.keywords.join(", ")} onChange={(e) => {
                                handleSkillChange(index, e.target.value.split(", "))
                            }} /> :
                            skill.keywords.join(", ")}
                    </div>
                ))}
            </section>
            <section className={clsx("mt-4", { "animate-pulse": isLoading })}>
                <h2><strong>Certifications</strong></h2>
                <ul>
                    {resume.certifications.map((certification: string, index: number) => (
                        <li key={index}>{certification}</li>
                    ))}
                </ul>
            </section>
            <section className={clsx("mt-4", { "animate-pulse": isLoading })}>
                <h2><strong>Education</strong></h2>
                {resume.education.map((education, index) => (
                    <div key={index}>
                        <h3>{education.studyType} in {education.area}</h3>
                        <p className={clsx("text-sm text-slate-400", { "animate-pulse": isLoading })}>{education.startDate} - {education.endDate}</p>
                        <p>{education.institution}</p>
                    </div>
                ))}
            </section>
            <section className={clsx("mt-4", { "animate-pulse": isLoading })}>
                <h2><strong>Work Experience</strong>
                    <button className=" p-2 rounded-md" onClick={handleWorkExperienceEditingToggle}>
                        {
                            isEditingWorkExperience ?
                                <CheckIcon className="w-3 h-3" /> : <PencilIcon className="w-3 h-3" />
                        }
                    </button></h2>
                {resume.workExperience.map((experience, index) => (
                    <div key={index} className={clsx("mb-4", { "animate-pulse": isLoading })}>
                        <h3><strong>Company: </strong>{experience.company}</h3>
                        <p><strong>Role: </strong>{experience.position}</p>
                        <p className={clsx("text-sm text-slate-400", { "animate-pulse": isLoading })} >
                            {experience.startDate} - {experience.endDate}
                        </p>
                        <ul>
                            {experience.highlights.map((highlight, index) => (
                                <li key={index}>{highlight}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
            <section className={clsx("mt-4", { "animate-pulse": isLoading })}>
                <h2><strong>Projects</strong>
                    <button className=" p-2 rounded-md" onClick={handleProjectsEditingToggle}>
                        {
                            isEditingProjects ?
                                <CheckIcon className="w-3 h-3" /> : <PencilIcon className="w-3 h-3" />
                        }
                    </button></h2>
                {resume.projects.map((project, index) => (
                    <div key={index} className={clsx("mb-4", { "animate-pulse": isLoading })}>
                        <h3><strong>{project.name}</strong></h3>
                        <p>{project.description}</p>
                        <p><strong>Tech Stack: </strong>{project.highlights?.join(", ")}</p>
                        {project.url &&
                            <p><strong>URL: </strong>
                                <Link target="_blank" href={project.url} >{project.url}</Link>
                            </p>
                        }
                    </div>
                ))}
            </section>
        </>
    )
}
