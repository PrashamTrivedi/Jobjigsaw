import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {RouterProvider, createBrowserRouter} from "react-router-dom"
import MainResume from "./mainResume.tsx"
import SavedJobs from "./savedJobs.tsx"
import CreateJob from "./createJob.tsx"
import ErrorPage from "./errorPage.tsx"

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/main-resume',
    element: <MainResume />,
  },
  {
    path: '/saved-jobs', element: <SavedJobs />,

  },
  {path: '/create-job', element: <CreateJob />},
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
