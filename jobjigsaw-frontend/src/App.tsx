import {useState} from 'react'
import './App.css'
import {InferJobButton, InferJobMatchButton} from "./buttons"
import {inferJob, inferJobMatch} from "./data/jobInferrence"
import MainContent from "./mainContent"

function App() {

  const [inferPending, toggleInferPending] = useState(false)
  const [inferMatchPending, toggleInferMatchPending] = useState(false)
  const [jobDescription, setJobDescription] = useState('')

  async function handleInferJob() {
    toggleInferPending(true)
    const job = await inferJob(jobDescription)
    toggleInferPending(false)
    return job
  }

  async function handleInferJobMatch() {
    toggleInferMatchPending(true)
    const job = await inferJobMatch(jobDescription)
    toggleInferMatchPending(false)
    return job
  }
  return (

    <MainContent>
      <div className="p-4">

        <textarea
          className="w-full p-2 border border-gray-300 dark:border-gray-700 dark:bg-black rounded"
          rows={10}
          placeholder="Enter Job Description"
          id="jobDescription"
          name="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={inferPending || inferMatchPending}
        />

        <div className="flex space-x-4 mt-4">
          <InferJobButton pending={inferPending} onClick={handleInferJob} />
          <InferJobMatchButton pending={inferMatchPending} onClick={handleInferJobMatch} />
        </div>
      </div>

    </MainContent>

  )
}


export default App
