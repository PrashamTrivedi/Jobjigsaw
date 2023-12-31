import {Project, Resume, Skills, WorkExperience, addProject, getMainResume, updateExperience, updateSkills} from "./data/mainResume"

import {Suspense, useEffect, useState} from "react"
import ResumeComponent from "./resume"


export default function MainResume() {


    useEffect(() => {
        // console.log("Calling API")
        (async () => {
            const mainResume = await getMainResume()
            console.log(`mainResume: ${JSON.stringify(mainResume)}`)
            setMainResume(mainResume)
        })()

    }, [])
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

    async function updateSkillsFromResume(skills: Skills[]) {
        const updatedResume = await updateSkills({skills})
        console.log(`updatedResume: ${JSON.stringify(updatedResume)}`)
        // setMainResume(updatedResume)
    }

    async function updateExperienceFromResume(experience: WorkExperience) {
        const updatedResume = await updateExperience(experience)
        console.log(`updatedResume: ${JSON.stringify(updatedResume)}`)
        // setMainResume(updatedResume)
    }

    async function updateProjectsFromResume(project: Project) {
        const updatedResume = await addProject(project)
        console.log(`updatedResume: ${JSON.stringify(updatedResume)}`)
        // setMainResume(updatedResume)
    }

    async function handleResumeUpdated(resume: Resume) {
        console.log(`resume: ${JSON.stringify(resume)}`)
        console.log(`mainResume: ${JSON.stringify(mainResume)}`)
        if (resume.skills !== mainResume.skills) {
            console.log("Skills changed")
            await updateSkillsFromResume(resume.skills)
        } else if (resume.workExperience !== mainResume.workExperience) {
            console.log("Experience changed")
            const workExperiencePromises = resume.workExperience.map((experience) => {
                return updateExperienceFromResume(experience)
            })
            await Promise.all(workExperiencePromises)
        } else if (resume.projects !== mainResume.projects) {
            console.log("Projects changed")
            const projectsPromises = resume.projects.map((project) => {
                return updateProjectsFromResume(project)
            })
            await Promise.all(projectsPromises)
        } else {
            console.log("Nothing changed")
        }

    }



    return (

        <Suspense fallback={<div>Loading...</div>}>
            <ResumeComponent initialResume={JSON.parse(JSON.stringify(mainResume))} onResumeUpdated={handleResumeUpdated} />
        </Suspense>
    )
}