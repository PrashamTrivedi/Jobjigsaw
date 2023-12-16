import {cookies} from "next/headers"
import {inferJob, inferJobMatch} from "@/app/lib/actions/jobInferrence"
import {InferJobButton, InferJobMatchButton} from "@/app/ui/buttons"

export default function Page() {

    const jobDescription = cookies().get("jobDescription")?.value ?? "No Job Description Found"
    const inferredJobString = cookies().get("inferredJob")?.value
    const inferredJobMatchString = cookies().get("inferredJobMatch")?.value

    const inferredJob = JSON.parse(inferredJobString ?? "{}")
    const inferredJobMatch = JSON.parse(inferredJobMatchString ?? "{}")


    return (
        <>
            <h1 className="text-4xl font-bold text-center dark:text-white">
                Job Description
            </h1>
            <p id="jobDescription" className="text-lg mt-4 dark:text-gray-300">
                {jobDescription}
            </p>
            <h2 className="text-3xl font-bold mt-8 dark:text-white">
                Inferred Job
            </h2>

            {
                Object.keys(inferredJob).length === 0 ? (
                    <form action={inferJob} className="mt-4">
                        <input type="hidden" value={jobDescription} name="jobDescription" />

                        <InferJobButton />
                    </form >
                ) :

                    <div className="mt-4">
                        <h3 className="text-2xl mt-2 font-bold dark:text-white">
                            Company name
                        </h3>
                        <p className="text-lg mt-2 dark:text-gray-300">
                            {inferredJob.inferredDescription.companyName}
                        </p>
                        <h3 className="text-2xl font-bold dark:text-white">
                            Job Title
                        </h3>
                        <p className="text-lg  dark:text-gray-300">
                            {inferredJob.inferredDescription.jobTitle}
                        </p>
                        {Object.entries(inferredJob.inferredDescription).map(([key, value]) => {
                            return (
                                <div key={key} className="mt-4">
                                    <h3 className="text-2xl font-bold dark:text-white">
                                        {key}
                                    </h3>
                                    <p className="text-lg mt-2 dark:text-gray-300">
                                        {JSON.stringify(value)}
                                    </p>
                                </div>
                            )
                        })}
                        <form action={inferJob} className="mt-4">
                            <input type="hidden" value={jobDescription} name="jobDescription" />

                            <InferJobButton defaultText="Re-Infer Job" />
                        </form >
                    </div>
            }
            <h2 className="text-3xl font-bold mt-8 dark:text-white">
                Inferred Job Match
            </h2>
            {
                Object.keys(inferredJobMatch).length === 0 ? (
                    <form action={inferJobMatch} className="mt-4">
                        <input type="hidden" value={jobDescription} name="jobDescription" />

                        <InferJobMatchButton />
                    </form >
                ) :
                    <>
                        {Object.entries(inferredJobMatch.compatibilityMatrix).map(([key, value]) => {
                            console.log(`key: ${key}, value: ${JSON.stringify(inferredJobMatch[key])}`)

                            return (
                                <div key={key} className="mt-4">
                                    <h3 className="text-2xl font-bold dark:text-white">
                                        {key}
                                    </h3>
                                    <p className="text-lg mt-2 dark:text-gray-300">
                                        {JSON.stringify(value)}
                                    </p>
                                </div>
                            )
                        })}
                        <form action={inferJobMatch} className="mt-4">
                            <input type="hidden" value={jobDescription} name="jobDescription" />

                            <InferJobMatchButton defaultText="Re-Infer Match" />                        </form >
                    </>
            }
        </>
    )
}