import {useState} from 'react'
import './App.css'
import {InferJobButton, InferJobMatchButton} from "./buttons"
import {inferJob, inferJobMatch} from "./data/jobInferrence"
import MainContent from "./mainContent"
import InferredJob from "./inferredJob"

function App() {

  const [viewName, setViewName] = useState('form')


  const [inferPending, toggleInferPending] = useState(false)
  const [inferMatchPending, toggleInferMatchPending] = useState(false)

  const [jobDescription, setJobDescription] = useState('')
  const [inferredJob, setInferredJob] = useState({})
  const [inferredJobMatch, setInferredJobMatch] = useState({})

  async function handleInferJob() {
    try {

      toggleInferPending(true)
      const data = await inferJob(jobDescription)
      setInferredJob(data)
      toggleInferPending(false)
      setViewName('inferrence')
    } catch (error) {
      console.error(error)
      toggleInferPending(false)
    }
  }

  async function handleInferJobMatch() {
    try {

      toggleInferMatchPending(true)
      const job = await inferJobMatch(jobDescription)
      setInferredJobMatch(job)
      toggleInferMatchPending(false)
      setViewName('inferrence')
    } catch (error) {
      console.error(error)
      toggleInferMatchPending(false)

    }

  }
  return (

    <MainContent>
      {
        viewName === 'form' &&
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
        </div>}
      {viewName === 'inferrence' &&
        <InferredJob
          jobDescription={jobDescription}
          job={inferredJob}
          match={inferredJobMatch} />
      }


    </MainContent>

  )
}


export default App
