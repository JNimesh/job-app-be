import { Request, Response } from 'express';
import * as jobSeekerService from '../services/jobSeekerService';
import { JobSeekerCreationAttributes, JobSeekerUpdateAttributes } from '../types/jobSeekerTypes';
import exp from "node:constants";

export const createJobSeeker = async (req: Request, res: Response) => {
    try {
        const jobSeekerData: JobSeekerCreationAttributes = req.body;
        const jobSeeker = await jobSeekerService.createJobSeeker(jobSeekerData);
        res.status(201).json(jobSeeker);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Failed to create profile' });
    }
};

export const getJobSeeker = async (req: Request, res: Response) => {
    try {
        const jobSeekerId = parseInt(req.params.jobSeekerId);
        const jobSeeker = await jobSeekerService.getJobSeeker(jobSeekerId);
        if (jobSeeker) {
            res.json(jobSeeker);
        } else {
            res.status(404).json({ message: 'Job seeker not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Getting the job seeker profile failed!' });
    }
};

export const getJobSeekerByEmail = async (req: Request, res: Response) => {
    try {
        const email = req.query.email as string;
        const jobSeeker = await jobSeekerService.getJobSeekerByEmail(email);
        if (jobSeeker) {
            res.json(jobSeeker);
        } else {
            res.status(404).json({ message: 'Job seeker not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Getting the job seeker profile failed!' });
    }
}

export const updateJobSeeker = async (req: Request, res: Response) => {
    try {
        const jobSeekerId = parseInt(req.params.jobSeekerId);
        const jobSeekerData: JobSeekerUpdateAttributes = req.body;
        const updatedJobSeeker = await jobSeekerService.updateJobSeeker(jobSeekerId, {sectorPreference: jobSeekerData.sectorPreference});
        res.json(updatedJobSeeker);
    } catch (error) {
        res.status(400).json({ message: 'Updating the job seeker failed' });
    }
};

export const deleteJobSeeker = async (req: Request, res: Response) => {
    try {
        const jobSeekerId = parseInt(req.params.jobSeekerId);
        await jobSeekerService.deleteJobSeeker(jobSeekerId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Deletion failed for job seeker' });
    }
};

export const generatePDFResume = async (req: Request, res: Response) => {
    try {
        const jobSeekerId = parseInt(req.params.jobSeekerId);
        const { stream: pdfResume, fileName} = await jobSeekerService.generatePDFResume(jobSeekerId);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        pdfResume.end();  // Call 'end' before piping to finalize the document.

        // Stream the PDF into the response
        pdfResume.pipe(res);
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate PDF resume' });
    }
}
