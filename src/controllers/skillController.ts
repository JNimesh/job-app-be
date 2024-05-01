import { Request, Response } from 'express';
import * as skillService from '../services/skillService';
import { Skill } from '../types/skillTypes';

export const syncSkills = async (req: Request, res: Response) => {
    const { jobSeekerId } = req.params;
    const skillsData: Skill[] = req.body;
    try {
        const jobSeekerProfile = await skillService.syncSkillRecords(parseInt(jobSeekerId), skillsData);
        res.status(200).json(jobSeekerProfile);
    } catch (error) {
        res.status(500).json({ message: 'Failed to sync skills' });
    }
};
