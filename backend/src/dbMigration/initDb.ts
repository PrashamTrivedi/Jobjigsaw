export default `
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    companyName TEXT NOT NULL,
    jobTitle TEXT NOT NULL,
    jobDescription TEXT NOT NULL,
    jobUrl TEXT,
    jobStatus TEXT NOT NULL,
    jobSource TEXT,
    jobType TEXT,
    jobLocation TEXT,
    jobSalary TEXT,
    jobContact TEXT,
    jobNotes TEXT,
    jobDateApplied TEXT,
    jobDateCreated TEXT NOT NULL,
    jobDateUpdated TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resumeName TEXT NOT NULL,
    resumeContent TEXT NOT NULL,
    jobId INTEGER,
    dateCreated TEXT NOT NULL,
    dateUpdated TEXT NOT NULL,
    FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS mainResumes (
    id INTEGER PRIMARY KEY,
    resumeName TEXT NOT NULL,
    resumeContent TEXT NOT NULL,
    dateCreated TEXT NOT NULL,
    dateUpdated TEXT NOT NULL
);
`;
