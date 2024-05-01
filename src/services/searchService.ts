import { Op } from 'sequelize';
import { JobSeeker, Education, Qualification, Skill, Experience } from '../models';
import { SearchParams } from '../types/searchTypes';
import { getEducationLevelRank } from "../models/education";

export const searchJobSeekers = async (params: SearchParams) => {
    const whereClauses: Record<string, unknown> = {};
    const educationWhereClauses: Record<string, unknown> = {};
    const educationalQualificationWhereClauses: Record<string, unknown> = {};
    const professionalQualificationWhereClauses: Record<string, unknown> = {};
    const skillWhereClauses: Record<string, unknown> = {};
    const experienceWhereClauses: Record<string, unknown> = {};

    // Sector preference
    if (params.sectorPreference) {
        whereClauses['sectorPreference'] = { [Op.like]: `%${params.sectorPreference}%` };
    }

    // Education level filtering
    if (params.minimumEducationLevel) {
        const levelRank = getEducationLevelRank(params.minimumEducationLevel);
        if (levelRank) {
            educationWhereClauses['levelRank'] = { [Op.gte]: levelRank };
        }
    }

    // Number of GCSE passes filtering
    if (params.minimumEducationLevel === 'GCSE' && params.numberOfGCSEPasses !== undefined) {
        educationWhereClauses['numPasses'] = { [Op.gte]: params.numberOfGCSEPasses };
        educationWhereClauses['level'] = 'GCSE';
    }

    // Educational qualifications filtering
    if (params.educationalQualificationName) {
        educationalQualificationWhereClauses['name'] = { [Op.like]: `%${params.educationalQualificationName}%` };
        educationalQualificationWhereClauses['type'] = 'Educational';
    }

    // Professional qualifications filtering
    if (params.professionalQualificationName) {
        professionalQualificationWhereClauses['name'] = { [Op.like]: `%${params.professionalQualificationName}%` };
        professionalQualificationWhereClauses['type'] = 'Professional';
    }

    // Skills filtering
    if (params.skillName) {
        skillWhereClauses['name'] = { [Op.like]: `%${params.skillName}%` };
    }

    // Experience role filtering
    if (params.experienceRole) {
        experienceWhereClauses['role'] = { [Op.like]: `%${params.experienceRole}%` };
    }

    // Perform separate queries for each filter and collect IDs
    const filterResults: Set<number>[] = [];
    if (Object.keys(educationWhereClauses).length > 0) {
        const educations = await Education.findAll({
            attributes: ['jobSeekerId'],
            where: educationWhereClauses,
            group: ['jobSeekerId']
        });
        filterResults.push(new Set(educations.map(e => e.jobSeekerId)));
    }

    if (Object.keys(educationalQualificationWhereClauses).length > 0) {
        const qualifications = await Qualification.findAll({
            attributes: ['jobSeekerId'],
            where: educationalQualificationWhereClauses,
            group: ['jobSeekerId']
        });
        filterResults.push(new Set(qualifications.map(q => q.jobSeekerId)));
    }

    if (Object.keys(professionalQualificationWhereClauses).length > 0) {
        const qualifications = await Qualification.findAll({
            attributes: ['jobSeekerId'],
            where: professionalQualificationWhereClauses,
            group: ['jobSeekerId']
        });
        filterResults.push(new Set(qualifications.map(q => q.jobSeekerId)));
    }

    if (Object.keys(skillWhereClauses).length > 0) {
        const skills = await Skill.findAll({
            attributes: ['jobSeekerId'],
            where: skillWhereClauses,
            group: ['jobSeekerId']
        });
        filterResults.push(new Set(skills.map(s => s.jobSeekerId)));
    }

    if (Object.keys(experienceWhereClauses).length > 0) {
        const experiences = await Experience.findAll({
            attributes: ['jobSeekerId'],
            where: experienceWhereClauses,
            group: ['jobSeekerId']
        });
        filterResults.push(new Set(experiences.map(e => e.jobSeekerId)));
    }

    // Find intersection of all filter results
    const intersectedIds = filterResults.reduce((acc: null | Set<number>, set) => {
        if (!acc) return set;
        return new Set([...acc].filter(id => set.has(id)));
    }, null);
    const where = {
        ...whereClauses,
    }

    if ([educationWhereClauses, skillWhereClauses, experienceWhereClauses, educationalQualificationWhereClauses, professionalQualificationWhereClauses].some(obj => Object.keys(obj).length > 0)) {
        where['id'] = Array.from(intersectedIds || []);
    }

    // Fetch all job seekers with their complete details if they match all criteria
    return await JobSeeker.findAll({
        where,
        include: [
            { model: Education, as: 'education' },
            { model: Qualification, as: 'qualifications' },
            { model: Skill, as: 'skills' },
            { model: Experience, as: 'experiences' },
        ],
    });
};
