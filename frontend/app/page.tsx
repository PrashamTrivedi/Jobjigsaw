
import {InferJobButton, InferJobMatchButton} from "@/app/ui/buttons"


export default function Page() {


  return (

    <form className="p-4">


      <textarea
        className="w-full p-2 border border-gray-300 dark:border-gray-700 dark:bg-black rounded"
        rows={10}
        placeholder="Enter Job Description"
        id="jobDescription"
        name="jobDescription"
      />
      <div className="flex space-x-4 mt-4">
        <InferJobButton />
        <InferJobMatchButton />
      </div>
    </form >

  )
}
