import { JobSeeker } from '../models/jobSeeker';
import { JobSeekerCreationAttributes, JobSeekerUpdateAttributes, JobSeekerProfile } from '../types/jobSeekerTypes';
import {Education, Experience, Qualification, Skill} from "../models";
import PDFDocument from 'pdfkit';

export const createJobSeeker = async (jobSeekerData: Partial<JobSeekerCreationAttributes>): Promise<JobSeekerProfile> => {
    const jobSeeker = await JobSeeker.create(jobSeekerData);
    return jobSeeker.toJSON() as JobSeekerProfile;
};

export const getJobSeeker = async (jobSeekerId: number): Promise<JobSeekerProfile | null> => {
    const jobSeeker = await JobSeeker.findByPk(jobSeekerId, {
        // Include associations here
        include: [
            { model: Skill, as: 'skills' }, // Adjust 'as' if you have a different alias in your association
            { model: Experience, as: 'experiences' },
            { model: Qualification, as: 'qualifications' },
            { model: Education, as: 'education' }
        ]
    });

    // Convert to JSON and cast to JobSeekerProfile if jobSeeker is not null
    return jobSeeker ? jobSeeker.toJSON() as JobSeekerProfile : null;
};


export const getJobSeekerByEmail = async (email: string): Promise<JobSeekerProfile | null> => {
    const jobSeeker = await JobSeeker.findOne({
        where: {
            email
        },
        include: [
            { model: Skill, as: 'skills' },
            { model: Experience, as: 'experiences' },
            { model: Qualification, as: 'qualifications' },
            { model: Education, as: 'education' }
        ]
    });
    return jobSeeker ? jobSeeker.toJSON() as JobSeekerProfile : null;
}

export const updateJobSeeker = async (jobSeekerId: number, jobSeekerData: JobSeekerUpdateAttributes): Promise<JobSeekerProfile> => {
    const jobSeeker = await JobSeeker.findByPk(jobSeekerId);
    if (!jobSeeker) throw new Error('JobSeeker not found');
    await jobSeeker.update(jobSeekerData);
    return jobSeeker.toJSON() as JobSeekerProfile;
};

export const deleteJobSeeker = async (jobSeekerId: number): Promise<void> => {
    const jobSeeker = await JobSeeker.findByPk(jobSeekerId);
    if (!jobSeeker) throw new Error('JobSeeker not found');
    await jobSeeker.destroy();
};


export const generatePDFResume = async (jobSeekerId: number)   => {
    // Fetch job seeker profile
    const jobSeeker = await getJobSeeker(jobSeekerId);
    if (!jobSeeker) throw new Error('JobSeeker not found');

    const doc = new PDFDocument();

    doc.fontSize(25).text('Job Seeker Profile', {
        underline: true,
    });

    doc.moveDown();
    doc.fontSize(18).text('Personal Details', {
        underline: true,
    });

    doc.fontSize(12).text(`Name: ${jobSeeker.name}`, {
        continued: true
    }).text(` (ID: ${jobSeeker.id})`, {
        underline: true,
        align: 'right'
    });

    doc.text(`Email: ${jobSeeker.email}`);
    doc.text(`Sector Preference: ${jobSeeker.sectorPreference}`);

    if (jobSeeker.skills && jobSeeker.skills.length > 0) {
        doc.moveDown();
        doc.fontSize(18).text('Skills', {
            underline: true,
        });
        jobSeeker.skills.forEach(skill => {
            doc.fontSize(12).list([`${skill.name} (${skill.proficiencyLevel})`]);
        });
    }

    if (jobSeeker.experiences && jobSeeker.experiences.length > 0) {
        doc.moveDown();
        doc.fontSize(18).text('Experiences', {
            underline: true,
        });
        jobSeeker.experiences.forEach(exp => {
            doc.fontSize(12).text(`${exp.role} at ${exp.company}, from ${exp.startDate} to ${exp.endDate || 'Present'}`);
            doc.text(`${exp.description}`);
        });
    }

    if (jobSeeker.educationDetails && jobSeeker.educationDetails.length > 0) {
        doc.moveDown();
        doc.fontSize(18).text('Education', {
            underline: true,
        });
        jobSeeker.educationDetails.forEach(edu => {
            doc.fontSize(12).text(`${edu.level} in ${edu.fieldOfStudy} from ${edu.institution} (Completed in ${edu.yearCompleted})`);
        });
    }

    if (jobSeeker.qualifications && jobSeeker.qualifications.length > 0) {
        doc.moveDown();
        doc.fontSize(18).text('Qualifications', {
            underline: true,
        });
        jobSeeker.qualifications.forEach(qual => {
            doc.fontSize(12).text(`${qual.type} - ${qual.name} from ${qual.issuingOrganization} (Obtained in ${qual.dateObtained})`);
        });
    }
    return {
        fileName: `jobSeeker_${jobSeeker.id} _${jobSeeker.name}_resume.pdf`,
        stream: doc,
    }
}
