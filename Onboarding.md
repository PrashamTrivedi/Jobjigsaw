
# Jobjigsaw Onboarding

Welcome to Jobjigsaw! This document will provide you with the essential information you need to get started with the project.

## Overview

Jobjigsaw is a web application designed to streamline the job application process. It consists of a backend API and a frontend client.

*   **Backend:** Built with **Express.js** and **TypeScript**. It handles data storage, job and resume management, and integration with the OpenAI API.
*   **Frontend:** Built with **React**, **Vite**, and **TypeScript**. It provides the user interface for interacting with the application.

## Getting Started

1.  **Prerequisites:** Make sure you have **Node.js**, **npm**, and **Docker** installed.
2.  **Environment Variables:**
    *   In the `backend` directory, copy `.env.reference` to `.env` and fill in the required API keys and configuration.
    *   The frontend uses Vite for environment variables. You can create a `.env.local` file in the `jobjigsaw-frontend` directory to override the default settings.
3.  **Running the Application:**
    *   **Backend:**
        ```bash
        cd backend
        npm install
        npm run dev
        ```
    *   **Frontend:**
        ```bash
        cd jobjigsaw-frontend
        npm install
        npm run dev
        ```

## Codebase Rules and Patterns

To maintain consistency and code quality, please adhere to the following rules and patterns.

### Backend

*   **Framework:** **Express.js** is the core framework. All new backend features must be implemented as Express middleware and routers.
*   **Database:** We use **better-sqlite3**. All database interactions must go through the `JobModel` classes. Do not write raw SQL queries in the controllers.
*   **Project Structure:** The backend is organized by feature. When adding a new feature, create a new directory with `Controller`, `Model`, and `Router` files.
    *   **`YourFeatureController.ts`:** Handles request and response logic.
    *   **`YourFeatureModel.ts`:** Handles database interactions.
    *   **`YourFeatureRouter.ts`:** Defines API endpoints.
*   **API Endpoints:** All API endpoints must be defined in a dedicated router file and then imported into `routes.ts`.
*   **API Documentation:** Use **Swagger** to document all new API endpoints. Follow the existing JSDoc format in the controller files.
*   **Logging:** Use the provided `Logger` utility (`utils/logger.ts`) for all logging.
*   **Error Handling:** **Sentry** is used for error tracking. Ensure that errors are properly caught and handled.

### Frontend

*   **Framework:** **React** with **Vite** is our frontend stack. All new UI components must be functional components using React Hooks.
*   **Routing:** We use **React Router**. All new pages must be added to the router configuration in `main.tsx`.
*   **State Management:** Use React's built-in state management (`useState`, `useEffect`). For more complex state, consider using `useReducer`.
*   **Data Fetching:** Use **axios** for all API calls. All data-fetching logic must be placed in the `src/data` directory, with a separate file for each feature (e.g., `jobs.ts`).
*   **Styling:** We use **Tailwind CSS**. Do not write custom CSS files. Use Tailwind utility classes for all styling.
*   **TypeScript:** The entire frontend is written in **TypeScript**. Use appropriate types for all variables, props, and function signatures.

## Final Notes

*   This is a personal project, so feel free to experiment and make improvements.
*   Before making any major changes, please discuss them with the project owner.
*   Have fun coding!
