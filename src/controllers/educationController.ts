import { Request, Response } from 'express';
import * as educationService from '../services/educationService';
import { Education } from '../types/educationTypes';

export const bulkAddOrUpdateEducation = async (req: Request, res: Response) => {
    const { jobSeekerId } = req.params;
    const educationData: Education[] = req.body;
    try {
        const jobSeekerProfile = await educationService.syncEducationRecords(parseInt(jobSeekerId), educationData);
        res.status(200).json(jobSeekerProfile);
    } catch (error) {
        res.status(500).json({ message: 'Bulk update/create failed for experiances' });
    }
};
