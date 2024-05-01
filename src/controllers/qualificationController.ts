import { Request, Response } from 'express';
import * as qualificationService from '../services/qualificationService';
import { Qualification } from '../types/qualificationTypes';

export const syncQualifications = async (req: Request, res: Response) => {
    const { jobSeekerId } = req.params;
    const qualificationsData: Qualification[] = req.body;
    try {
        const jobSeekerProfile = await qualificationService.syncQualificationRecords(parseInt(jobSeekerId), qualificationsData);
        res.status(200).json(jobSeekerProfile);
    } catch (error) {
        res.status(500).json({ message: 'Failed to sync qualifications' });
    }
};
