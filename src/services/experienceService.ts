import { Experience } from '../models/experience';
import { Experience as ExperienceType } from '../types/experienceTypes';
import { sequelize } from '../models';
import * as jobSeekerService from "./jobSeekerService";
import {JobSeekerProfile} from "../types/jobSeekerTypes";

export const syncExperienceRecords = async (jobSeekerId: number, experiencesData: ExperienceType[]) => {
  const transaction = await sequelize.transaction();
  try {
    const existingExperiences = await Experience.findAll({ where: { jobSeekerId }, transaction });

    const incomingExperienceMap = new Map(experiencesData.map(e => [(e.id !== undefined) ? e.id.toString() : `${e.role}-${e.company}-${e.startDate}`, e]));

    const existingExperiencesToDelete = existingExperiences.filter(exp => !incomingExperienceMap.has(exp.id.toString()));
    await Experience.destroy({ where: { id: existingExperiencesToDelete.map(exp => exp.id) }, transaction });

    for (const [, expData] of incomingExperienceMap) {
      if (expData.id) {
        await Experience.update(expData, { where: { id: expData.id, jobSeekerId }, transaction });
      } else {
        await Experience.create({ ...expData, jobSeekerId }, { transaction });
      }
    }

    await transaction.commit();
    return await jobSeekerService.getJobSeeker(jobSeekerId) as JobSeekerProfile;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
