# Frontend Modernization Plan: Migrating from React (Vite) to Next.js

This document outlines the plan to migrate the legacy `frontend` (React with Vite) to the new `jobjigsaw-frontend` (Next.js) application.

## 1. Project Setup and Configuration

*   **Tailwind CSS:** The new Next.js project already has `postcss.config.mjs` which is a good sign. I will ensure a `tailwind.config.ts` (or `.js` or `.mjs`) is present and configured to scan the `src/app` directory for Tailwind classes. I will copy the Tailwind configuration from the legacy project to ensure consistent styling.
*   **Dependencies:** I will review the `package.json` of the legacy project and add any necessary dependencies to the `jobjigsaw-frontend` project. This includes libraries like `@heroicons/react`, `clsx`, and `react-markdown`.

## 2. Component Migration

The core of the migration will be moving the React components from `frontend/src` to `jobjigsaw-frontend/src/components` (or a similar directory for shared components). I will then use these components within the new Next.js pages.

I will start with the main layout and navigation components, then move to the individual page components.

## 3. Routing with Next.js App Router

I will replace the `react-router-dom` implementation with the Next.js App Router. This will involve creating a new directory structure under `jobjigsaw-frontend/src/app`.

The following routes will be created:

*   `/` - `app/page.tsx` (This will likely be the main content)
*   `/home` - `app/home/page.tsx`
*   `/main-resume` - `app/main-resume/page.tsx`
*   `/saved-jobs` - `app/saved-jobs/page.tsx`
*   `/create-job` - `app/create-job/page.tsx`
*   `/saved-resumes` - `app/saved-resumes/page.tsx`
*   `/saved-resumes/resume` - `app/saved-resumes/resume/page.tsx`
*   `/saved-resumes/resume/print` - `app/saved-resumes/resume/print/page.tsx`

Each of these directories will contain a `page.tsx` file that will be the main component for that route.

## 4. Data Fetching and API Routes

I will refactor the data fetching logic to use Next.js data fetching capabilities. The `backend` directory, which is a Cloudflare Workers backend, will be treated as an external API. I will use Next.js API Routes to proxy requests to the backend, ensuring that the frontend and backend remain decoupled.

*   **Server Components:** For pages that require data from the backend, I will use React Server Components (the default in the `app` directory) to fetch data on the server. This will improve performance and reduce the amount of client-side JavaScript.
*   **Client Components:** For components that require interactivity and client-side state, I will use the `'''use client'''` directive.
*   **API Calls:** The existing data fetching logic in `frontend/src/data` will be moved into the respective page components or into separate data fetching functions that are called from the page components. I will continue to use `fetch` or `axios` for making the API calls.

## 5. Homepage UI/UX Redesign

The current homepage has two separate buttons for "Infer Job" and "Infer Job Match". This will be redesigned to have a single "Analyze" button.

*   **URL Field:** An input field for a job posting URL will be added.
*   **Single "Analyze" Button:** This button will trigger a multi-step process:
    1.  **Job Analysis:** Fetch and analyze the job description from the provided URL.
    2.  **Fit Analysis:** Compare the job description with the user's resume.
    3.  **Search:** (This may be a future feature) Search for similar jobs.
*   **Results Presentation:** The results of the analysis will be presented to the user in a clear and concise format.

## 6. Styling

*   **Global Styles:** I will move the global styles from `frontend/src/index.css` to `jobjigsaw-frontend/src/app/globals.css`.
*   **Component Styles:** Since the project uses Tailwind CSS, the styles are already co-located with the components via utility classes. This will make the migration of styles straightforward.

## 7. Static Assets

I will move any static assets, such as SVGs or images, from `frontend/public` to `jobjigsaw-frontend/public`.

## 8. Step-by-Step Migration Plan

1.  **Configure Tailwind CSS:** Copy the `tailwind.config.js` from the legacy project to the new project and update the `content` paths.
2.  **Install Dependencies:** Add the necessary dependencies to the `jobjigsaw-frontend` `package.json`.
3.  **Create Layout:** Create a root layout in `jobjigsaw-frontend/src/app/layout.tsx` to share UI across multiple pages. This will include the main navigation.
4.  **Implement New Homepage:** Create the new homepage with the URL field and "Analyze" button in `jobjigsaw-frontend/src/app/page.tsx`.
5.  **Migrate `savedJobs.tsx`:** Create `jobjigsaw-frontend/src/app/saved-jobs/page.tsx` and migrate the `SavedJobs`, `JobsList`, and `JobsCard` components.
6.  **Migrate `createJob.tsx`:** Create `jobjigsaw-frontend/src/app/create-job/page.tsx` and migrate the `CreateJob` component.
7.  **Migrate `mainResume.tsx`:** Create `jobjigsaw-frontend/src/app/main-resume/page.tsx` and migrate the `MainResume` component.
8.  **Migrate `savedResumes.tsx`:** Create `jobjigsaw-frontend/src/app/saved-resumes/page.tsx` and migrate the `SavedResumes`, `ResumesList`, and `ResumeCard` components.
9.  **Migrate `resume.tsx`:** Create `jobjigsaw-frontend/src/app/saved-resumes/resume/page.tsx` and migrate the `Resumes` component.
10. **Migrate `printResume.tsx`:** Create `jobjigsaw-frontend/src/app/saved-resumes/resume/print/page.tsx` and migrate the `PrintResumeComponent`.
11. **Refactor Data Fetching:** For each migrated page, refactor the data fetching logic to use Next.js server-side data fetching, proxying requests through API Routes.
12. **Testing:** Thoroughly test each page to ensure that all functionality is working as expected.