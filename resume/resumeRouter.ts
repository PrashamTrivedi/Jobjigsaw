import express from 'express';
import ResumeController from './resumeController';

const resumeRouter = express.Router();
const resumeController = new ResumeController();

// Route to add a new resume
resumeRouter.post('/', resumeController.addResume);

// Route to retrieve all resumes
resumeRouter.get('/', resumeController.getAllResumes);

// Route to retrieve a resume by its id
resumeRouter.get('/:id', resumeController.getResume);

// Route to delete a resume by its id
resumeRouter.delete('/:id', resumeController.removeResume);

export default resumeRouter;
