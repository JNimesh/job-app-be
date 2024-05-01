import {Education, getEducationLevelRank} from '../models/education';
import {Education as EducationType} from '../types/educationTypes';
import {sequelize} from '../models/index';
import {JobSeekerProfile} from "../types/jobSeekerTypes";
import * as jobSeekerService from "./jobSeekerService";

export const syncEducationRecords = async (jobSeekerId: number, educationData: EducationType[]): Promise<JobSeekerProfile> => {
    const transaction = await sequelize.transaction();
    try {
        educationData.forEach(record => {
            record.levelRank = getEducationLevelRank(record.level);
        })
        // Load all existing education records for the job seeker
        const existingRecords = await Education.findAll({
            where: { jobSeekerId },
            transaction
        });

        // Map incoming records by id for existing records, or by a combination of attributes for new records
        const incomingRecordsMap = new Map(educationData.map(record => [ record.id  ? `${record.id}` : `${record.level}-${record.fieldOfStudy}-${record.institution}-${record.yearCompleted}`, record]));

        const existingRecordsToDelete = existingRecords.filter(record => !incomingRecordsMap.has(record.id.toString()));
        await Education.destroy({ where: { id: existingRecordsToDelete.map(record => record.id) }, transaction });

        // Add or update the remaining records in the incoming data map
        for (const [, record] of incomingRecordsMap) {
            if (record.id) {
                // Update existing records (if any left, though there shouldn't be)
                await Education.update(record, { where: { id: record.id, jobSeekerId }, transaction });
            } else {
                // Add new records
                await Education.create({ ...record, jobSeekerId }, { transaction });
            }
        }

        await transaction.commit();
        return await jobSeekerService.getJobSeeker(jobSeekerId) as JobSeekerProfile;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
