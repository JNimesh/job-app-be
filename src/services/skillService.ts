import { Skill } from '../models/skill';
import { Skill as SkillType } from '../types/skillTypes';
import { sequelize } from '../models/index';
import * as jobSeekerService from "./jobSeekerService";
import {JobSeekerProfile} from "../types/jobSeekerTypes";

export const syncSkillRecords = async (jobSeekerId: number, skillsData: SkillType[]) => {
    const transaction = await sequelize.transaction();
    try {
        const existingSkills = await Skill.findAll({ where: { jobSeekerId }, transaction });

        const incomingSkillsMap = new Map(skillsData.map(s => [s.id ? s.id.toString() : `${s.name}-${s.proficiencyLevel}`, s]));

        const existingSkillsToDelete = existingSkills.filter(skill => !incomingSkillsMap.has(skill.id.toString()));
        await Skill.destroy({ where: { id: existingSkillsToDelete.map(skill => skill.id) }, transaction });

        for (const [, sData] of incomingSkillsMap) {
            if (sData.id) {
                await Skill.update(sData, { where: { id: sData.id, jobSeekerId }, transaction });
            } else {
                await Skill.create({ ...sData, jobSeekerId }, { transaction });
            }
        }

        await transaction.commit();
        return await jobSeekerService.getJobSeeker(jobSeekerId) as JobSeekerProfile;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
