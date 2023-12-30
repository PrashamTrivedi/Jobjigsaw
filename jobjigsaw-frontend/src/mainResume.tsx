import {Resume, getMainResume} from "./data/mainResume"

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

    return (

        <Suspense fallback={<div>Loading...</div>}>
            <ResumeComponent resume={mainResume} />
        </Suspense>
    )
}