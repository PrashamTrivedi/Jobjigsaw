'use client'
import {inferJob, inferJobMatch} from "./lib/actions/jobInferrence"

export default function Home() {



  return (

    <form className="p-4">


      <textarea
        className="w-full p-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-600 rounded"
        rows={10}
        placeholder="Enter Job Description"
        id="jobDescription"
        name="jobDescription"
      />
      <div className="flex space-x-4 mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" formAction={inferJob}>Infer Job</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" formAction={inferJobMatch}>Infer Match</button>
      </div>
    </form >

  )
}
