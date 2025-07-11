## Comprehensive Coding Plan

### Phase 1: Backend Migration & Refactoring (Express to Hono, SQLite to D1, S3 to R2, OpenAI to AI Gateway)

**1. Core Framework & Dependencies:**

*   **`backend/package.json`**:
    *   **Remove:** `express`, `better-sqlite3`, `aws-sdk`, `morgan`.
    *   **Add:** `hono`, `@cloudflare/workers-types`, `@cloudflare/d1`, `@cloudflare/r2`, `@cloudflare/ai`, `wrangler` (dev dependency).
    *   **Update Scripts:** Add `wrangler deploy` script and a `migrate` script.

*   **New File: `wrangler.jsonc`**:
    *   **Purpose:** Cloudflare Wrangler configuration for Worker deployment.
    *   **Details:** Configure `name`, `main`, `compatibility_date`, `compatibility_flags`. Bindings for D1 (database), R2 (object storage), and AI Gateway will be added here. This file is essential for deploying the Hono backend as a Cloudflare Worker.

*   **`backend/index.ts`**:
    *   **Change:** Complete rewrite. Replace Express app setup with Hono app initialization, adapting it to the Cloudflare Worker environment.
    *   **Details:** The `fetch` handler will be the entry point for the Worker. It will receive `Request`, `Env` (where bindings are available), and `ExecutionContext`. The Hono app will be initialized and handle requests within this `fetch` handler. Remove Express-specific middleware.

*   **`backend/routes.ts`**:
    *   **Change:** Update to use Hono's `app.route()` method for combining routers.
    *   **Details:** Import Hono routers and replace `app.use()` with `app.route()`.

*   **`backend/utils/morganMiddleware.ts`**:
    *   **Change:** Remove. Hono has its own logging middleware or custom logging can be implemented.
    *   **Details:** Delete this file.

*   **`backend/utils/swagger.ts`**:
    *   **Change:** This is Express-specific. It will need to be updated for Hono or replaced with a Hono-compatible solution (e.g., OpenAPI specification generation). For a personal project, this might be simplified or removed initially if not critical.
    *   **Details:** Review and adapt or remove.

**2. Database Migration (better-sqlite3 to Cloudflare D1):**

*   **`backend/database.ts`**:
    *   **Change:** Complete rewrite for Cloudflare D1.
    *   **Details:** Remove `better-sqlite3` imports and logic. Implement D1 client initialization and asynchronous D1 query functions using `env.DB.prepare().all()`, `env.DB.prepare().run()`, etc. Ensure the D1 binding `DB` is configured in `wrangler.jsonc`. Implement a singleton pattern for the D1 connection.

*   **`backend/job/jobModel.ts`, `backend/mainResume/mainResumeModel.ts`, `backend/resume/resumeModel.ts`**:
    *   **Change:** Update database interaction methods to use the new D1 client from `backend/database.ts`.
    *   **Details:** Modify `db.prepare().run()`, `db.prepare().all()` calls to be asynchronous and use D1 syntax. Adjust SQL queries for D1 compatibility. Ensure proper error handling for D1 operations.

*   **New Directory: `backend/migrations/`**:
    *   **Purpose:** Store D1 migration files.
    *   **Details:** Each migration will be a `.sql` file. We will use `wrangler d1 migrations apply` to run these. The `package.json` `migrate` script will be updated to use this Wrangler command.

*   **`backend/package.json`**:
    *   **Change:** Update `migrate` script.
    *   **Details:** The `migrate` script will now execute `wrangler d1 migrations apply <DATABASE_NAME> --local` for local development and `wrangler d1 migrations apply <DATABASE_NAME>` for deployment.

**3. Blob Storage Migration (S3 to Cloudflare R2):**

*   **`backend/resume/resumeController.ts`**:
    *   **Change:** Update file upload/download logic to use Cloudflare R2.
    *   **Details:** Remove S3 client imports and logic. Add R2 client imports and logic. Modify methods handling resume storage to interact with R2, accessing the R2 bucket via `env.R2_BUCKET` (assuming `R2_BUCKET` is the binding name in `wrangler.jsonc`). Ensure proper error handling for R2 operations.

*   **`backend/resume/resumeModel.ts`**:
    *   **Change:** Update any direct storage interactions or path handling to align with R2.
    *   **Details:** Ensure paths and storage mechanisms are compatible with R2.

**4. AI Integration (OpenAI to Cloudflare AI Gateway):**

*   **`backend/openai.ts`**:
    *   **Change:** Rewrite to use Cloudflare AI Gateway.
    *   **Details:** Remove OpenAI API key and client setup. Instead of direct API calls, we will route requests through the Cloudflare AI Gateway. This involves constructing the appropriate `fetch` requests to the AI Gateway endpoint, including the `X-Custom-AI-Gateway-Key` header if needed. Update function calls to use AI Gateway methods, accessing the AI binding via `env.AI`. Implement robust error handling (retries, `try/catch`).

*   **`backend/job/jobController.ts`**:
    *   **Change:** Update calls to AI inference functions to use the new AI Gateway integration.
    *   **Details:** Ensure the controller calls the updated `openai.ts` functions, which now route through the AI Gateway.

*   **New Directory: `backend/prompts/`**:
    *   **Purpose:** Store externalized OpenAI prompts.
    *   **Details:** Create files like `job_inference_prompt.txt`, `resume_generation_prompt.txt`, etc., and move the large string literals from `backend/openai.ts` into these files. Update `openai.ts` to read these files. The AI Gateway will handle the actual prompt delivery to the LLM.

**5. Backend Refactoring & Improvements:**

*   **New Files: `backend/job/jobService.ts`, `backend/mainResume/mainResumeService.ts`, `backend/resume/resumeService.ts`**:
    *   **Purpose:** Implement service layers for business logic.
    *   **Details:** Move complex business logic (e.g., OpenAI calls, Jina calls, data processing) from controllers into these new service files.

*   **`backend/job/jobController.ts`, `backend/mainResume/mainResumeController.ts`, `backend/resume/resumeController.ts`**:
    *   **Change:** Refactor to use the new service layers and adapt to Hono's `Context` object.
    *   **Details:** Change function signatures from `(req: Request, res: Response)` to `(c: Context)`. Access request data via `c.req.json()`, `c.req.param()`, `c.req.query()`. Send responses via `c.json()`, `c.text()`, `c.body()`. Inject service layer dependencies into controllers (e.g., via constructor or a factory). Delegate all business logic to the service layer.

*   **New File: `backend/utils/streamUtils.ts`**:
    *   **Purpose:** Abstract streaming logic.
    *   **Details:** Create a utility function to handle the logic for streaming vs. non-streaming responses, removing repetitive `if (!isStream) { ... } else { ... }` blocks from controllers.

### Phase 2: Frontend Migration & Improvements

**1. Build & Deployment for Cloudflare Pages:**

*   **`frontend/package.json`**:
    *   **Change:** Update scripts for Cloudflare Pages deployment.
    *   **Details:** Add a `deploy` script (e.g., `npx wrangler pages deploy`). Ensure the `build` script is compatible with Cloudflare Pages static exports.

*   **`frontend/next.config.js`**:
    *   **Change:** Review and modify for Cloudflare Pages compatibility.
    *   **Details:** Ensure `output: 'export'` is set for static HTML export. Remove any Node.js specific configurations that are not compatible with static hosting.

**2. API Integration & Error Handling:**

*   **`frontend/app/lib/actions/jobs.ts`, `frontend/app/lib/actions/mainResume.ts`**:
    *   **Change:** Implement robust error handling for `fetch` calls and update API base URL.
    *   **Details:** Wrap `fetch` calls in `try/catch` blocks. Check `response.ok` property after every `fetch` call and throw an error or return a structured error object if `false`. Update the base URL for API calls (e.g., `process.env.NEXT_PUBLIC_API_BASE_URL`) to point to the new Cloudflare Worker endpoint.

**3. User Experience (UX) Improvements:**

*   **`frontend/app/create-job/page.tsx`**:
    *   **Change:** Implement loading states for long-running operations.
    *   **Details:** Use the `useFormStatus` hook from React to detect when a form submission is pending. Use this to show a loading indicator and disable submission buttons (e.g., "Infer Job Description", "Check Compatibility") during processing.

### Phase 3: Workflow & Feature Improvements

**1. Streamlined Inference Workflow ("Analyze Job" Button):**

*   **Frontend (`frontend/app/create-job/page.tsx`):**
    *   **Change:** Add a new "Analyze Job" button.
    *   **Details:** Modify the form submission handler to call a new backend endpoint (e.g., `/api/analyze-job`). Update the UI flow to seamlessly transition to a state where a tailored resume can be generated after analysis.

*   **Backend (New Endpoint & KV Integration):**
    *   **New Endpoint:** Create a new API endpoint (e.g., `/api/analyze-job`) in `backend/job/jobRouter.ts` and `backend/job/jobController.ts`.
    *   **Orchestration:** This endpoint will orchestrate the entire workflow: infer job details, infer compatibility against the main resume, and save the resultant data to a dedicated "viewed jobs KV" (Cloudflare KV).
    *   **New File: `backend/utils/cloudflareKv.ts`**:
        *   **Purpose:** Utility for Cloudflare KV interactions.
        *   **Details:** Implement functions to interact with Cloudflare KV, including setting keys with a TTL (e.g., 5 days) and removing keys when a job is saved. The KV namespace will be accessed via `env.VIEWED_JOBS_KV` (assuming `VIEWED_JOBS_KV` is the binding name in `wrangler.jsonc`).
    *   **`backend/job/jobService.ts`**:
        *   **Change:** Implement the logic for the new "Analyze Job" workflow, utilizing the Cloudflare KV utility.

*   **Frontend (Resume Creation from Cached Jobs):**
    *   **Change:** Update the resume creation flow to also start from cached jobs (inferred data from KV).
    *   **Details:** Modify the component that initiates resume creation (e.g., `frontend/app/saved-jobs/page.tsx` or a new component) to check for and utilize data from the "viewed jobs KV".

**2. Main Resume Management:**

*   **New Page: `frontend/app/main-resume-management/page.tsx`**:
    *   **Purpose:** Dedicated UI for uploading and managing the main resume.
    *   **Details:** Implement a file upload feature (PDF/JSON). Add logic to handle file selection and submission to the backend. Display current main resume details.

*   **`frontend/app/ui/navLinks.tsx`**:
    *   **Change:** Add a link to the new "Main Resume Management" page.
    *   **Details:** Add a new `NavLink` component for `/main-resume-management`.

*   **Backend (New Endpoints & PDF Parsing):**
    *   **New Endpoints:** Create new API endpoints in `backend/mainResume/mainResumeRouter.ts` and `backend/mainResume/mainResumeController.ts` (or a new service) for uploading/updating the main resume (e.g., `/api/main-resume/upload`).
    *   **PDF Parsing:** Implement PDF parsing logic (if a PDF is uploaded) to convert it into the standard JSON schema the application uses. This can leverage `env.AI.toMarkdown()` for PDF content extraction. Ensure compatibility with Cloudflare Workers.
    *   **`backend/mainResume/mainResumeModel.ts`**:
        *   **Change:** Update to handle storing the main resume in D1.
    *   **`backend/mainResume/mainResumeService.ts`**:
        *   **Change:** Implement the new upload and parsing logic.

**3. Enhanced ATS-Friendly Resume Generation:**

*   **`backend/prompts/resume_generation_prompt.txt` (or similar)**:
    *   **Change:** Refine the prompt for resume generation with more specific, expert-level ATS instructions.
    *   **Details:** Guide the LLM to use standard section headers, avoid complex formatting, employ chronological format, and integrate keywords naturally.

*   **`backend/resume/resumeService.ts`**:
    *   **Change:** Ensure the resume generation logic uses the refined ATS-friendly prompt.
