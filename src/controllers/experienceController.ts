import { Request, Response } from 'express';
import * as experienceService from '../services/experienceService';
import { Experience } from '../types/experienceTypes';

export const syncExperiences = async (req: Request, res: Response) => {
    const { jobSeekerId } = req.params;
    const experiencesData: Experience[] = req.body;
    try {
        const jobSeekerProfile = await experienceService.syncExperienceRecords(parseInt(jobSeekerId), experiencesData);
        res.status(200).json(jobSeekerProfile);
    } catch (error) {
        res.status(500).json({ message: 'Failed to sync experiences' });
    }
};
