export interface Env {
    DB: D1Database;
    R2_BUCKET: R2Bucket;
    AI: Ai;
    VIEWED_JOBS_KV: KVNamespace;
}

// Core Domain Interfaces

export interface Job {
    id?: number;
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    jobUrl?: string;
    jobStatus: string;
    jobSource?: string;
    jobType?: string;
    jobLocation?: string;
    jobSalary?: string;
    jobContact?: string;
    jobNotes?: string;
    jobDateApplied?: string;
    jobDateCreated: string;
    jobDateUpdated: string;
    inferredData?: string;    // JSON string from AI analysis
    jobFitScore?: number;     // 0-100 compatibility score
    jobFitBreakdown?: string; // JSON string of detailed breakdown
}

export interface Resume {
    id?: number;
    resumeName: string;
    resumeContent: string; // JSON string of resume data
    jobId?: number;        // Link to Job (may be missing from current schema)
    dateCreated: string;
    dateUpdated: string;
}

export interface MainResume {
    id: number; // Always 1
    resumeName: string;
    resumeContent: string; // JSON string of resume data
    dateCreated: string;
    dateUpdated: string;
}

// Database Response Types

export interface D1Result {
    success: boolean;
    meta: {
        changes: number;
        last_row_id: number;
        duration: number;
        size_after: number;
        rows_read: number;
        rows_written: number;
    };
}

export interface D1Response<T = unknown> {
    results: T[];
    success: boolean;
    meta: {
        duration: number;
        size_after: number;
        rows_read: number;
        rows_written: number;
    };
}

// API Response wrapper
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Error Handling Types
export interface AppError {
    message: string;
    status?: number;
    code?: string;
    details?: unknown;
}