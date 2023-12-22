import {Resume, getMainResume} from "./data/mainResume"

import MainContent from "./mainContent"
import {Suspense, useEffect, useState} from "react"
import ResumeComponent from "./resume"


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
                <ResumeComponent resume={mainResume} />
            </Suspense>
        </MainContent>
    )
}