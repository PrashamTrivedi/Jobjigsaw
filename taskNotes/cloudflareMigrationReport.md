# Cloudflare Migration Report

## 1. Introduction

This report outlines a plan for migrating the Jobjigsaw application from its current AWS AppRunner and S3 architecture to the Cloudflare platform. The goal is to leverage Cloudflare's features to potentially improve performance, reduce costs, and simplify the infrastructure.

## 2. Cloudflare Services Analysis

Based on the initial research, the following Cloudflare services are relevant to this migration:

*   **Cloudflare Workers:** A serverless platform for running backend code. This will replace AWS AppRunner.
*   **Cloudflare Pages:**  A platform for deploying and hosting static and server-rendered frontend applications. This will replace serving the React application from S3.
*   **Cloudflare D1:** A serverless SQL database based on SQLite. This will replace the current database solution.
*   **Cloudflare R2:** An object storage service compatible with the S3 API. This will be used for storing resumes and other user-uploaded files.
*   **Cloudflare AI Gateway:** A service to manage and control AI models. This can be used to manage the OpenAI integration.
*   **Cloudflare Web Analytics:** A privacy-focused web analytics service. This can be used to gather insights into website traffic.
*   **Hono:** A lightweight, fast, and multi-runtime web framework. It is a good candidate to replace Express.js for the backend, especially given its strong support for Cloudflare Workers.

## 3. Migration Strategy

The migration will be performed in a phased approach to minimize disruption.

### Phase 1: Backend Migration (API and Database)

1.  **Framework Migration (Express to Hono):**
    *   The existing Express.js backend will be migrated to Hono. This will involve rewriting the routes, controllers, and middleware to align with Hono's API.
    *   The current `database.ts` will be replaced with a new implementation that uses Cloudflare D1.
    *   The `jobModel.ts`, `mainResumeModel.ts`, and `resumeModel.ts` will be updated to use the D1 database.
    *   The OpenAI integration will be updated to use the Cloudflare AI Gateway.

2.  **Database Migration:**
    *   A new D1 database will be created.
    *   The existing data will be exported and imported into the D1 database.

3.  **Blob Storage Migration:**
    *   An R2 bucket will be created.
    *   The existing resumes and other user-uploaded files will be migrated from S3 to R2.

4.  **Deployment:**
    *   The Hono backend will be deployed as a Cloudflare Worker.

### Phase 2: Frontend Migration

1.  **Build and Deployment:**
    *   The Next.js frontend will be configured to be deployed on Cloudflare Pages.
    *   The existing `package.json` will be updated with the necessary scripts for building and deploying to Cloudflare Pages.

2.  **API Integration:**
    *   The frontend will be updated to communicate with the new Hono backend running on a Cloudflare Worker.

### Phase 3: Analytics and Monitoring

1.  **Web Analytics:**
    *   Cloudflare Web Analytics will be enabled for the frontend application.

2.  **Monitoring:**
    *   The Cloudflare dashboard will be used to monitor the performance and usage of the Workers, D1, R2, and AI Gateway.

## 4. Architectural Overview

The new architecture will be as follows:

*   **Frontend:** Next.js application hosted on Cloudflare Pages.
*   **Backend:** Hono API running on Cloudflare Workers.
*   **Database:** Cloudflare D1.
*   **File Storage:** Cloudflare R2.
*   **AI Integration:** Cloudflare AI Gateway.
*   **Analytics:** Cloudflare Web Analytics.

This architecture will be more integrated and should provide better performance and lower costs compared to the current AWS-based setup.

## 5. Next Steps

The next steps will be to start the backend migration by setting up a new Hono project and migrating the existing Express.js code.
