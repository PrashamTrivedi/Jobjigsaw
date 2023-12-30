import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {RouterProvider, createBrowserRouter} from "react-router-dom"
import MainResume from "./mainResume.tsx"
import SavedJobs from "./savedJobs.tsx"
import CreateJob from "./createJob.tsx"
import ErrorPage from "./errorPage.tsx"
import Resumes from "./resumes.tsx"
import SavedResumes from "./savedResumes.tsx"
import MainContent from "./mainContent.tsx"

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainContent />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/home',
        element: <App />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/main-resume',
        element: <MainResume />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/saved-jobs', element: <SavedJobs />,
        errorElement: <ErrorPage />,

      },
      {
        path: '/create-job', element: <CreateJob />,
        errorElement: <ErrorPage />,
      },
      {
        path: '/saved-resumes', element: <SavedResumes />,
        errorElement: <ErrorPage />,

      },
      {
        path: '/saved-resumes/resume',
        element: <Resumes />,
        errorElement: <ErrorPage />,
      }
    ]
  },


])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
