import { Qualification } from '../models/qualification';
import { Qualification as QualificationType } from '../types/qualificationTypes';
import { sequelize } from '../models/index';
import * as jobSeekerService from "./jobSeekerService";
import {JobSeekerProfile} from "../types/jobSeekerTypes";

export const syncQualificationRecords = async (jobSeekerId: number, qualificationsData: QualificationType[]) => {
    const transaction = await sequelize.transaction();
    try {
        // Fetch existing qualifications for the job seeker
        const existingQualifications = await Qualification.findAll({ where: { jobSeekerId }, transaction });

        // Create a map with either the qualification id or a composite key
        const incomingQualificationMap = new Map(qualificationsData.map(q => [(q.id !== undefined) ? `${q.id}` : `${q.name}-${q.issuingOrganization}-${q.dateObtained}`, q]));

        const existingQualificationsToDelete = existingQualifications.filter(q => !incomingQualificationMap.has(q.id.toString()));
        await Qualification.destroy({ where: { id: existingQualificationsToDelete.map(q => q.id) }, transaction });

        // Update existing or create new qualifications from the remaining items in the map
        for (const [key, qData] of incomingQualificationMap) {
            if (qData.id) { // Indicates an existing qualification
                await Qualification.update(qData, { where: { id: key, jobSeekerId }, transaction });
            } else { // Indicates a new qualification
                await Qualification.create({ ...qData, jobSeekerId }, { transaction });
            }
        }

        // Commit the transaction if all operations were successful
        await transaction.commit();
        return await jobSeekerService.getJobSeeker(jobSeekerId) as JobSeekerProfile;
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        throw error;
    }
};

