import express from 'express';
import * as jobSeekerController from '../controllers/jobSeekerController';
import {bulkAddOrUpdateEducation} from "../controllers/educationController";
import {syncExperiences} from "../controllers/experienceController";
import {syncQualifications} from "../controllers/qualificationController";
import {syncSkills} from "../controllers/skillController";
import {search} from "../controllers/searchController";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     JobSeekerCreationAttributes:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - sectorPreference
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         sectorPreference:
 *           type: string
 *           example: IT
 *     JobSeekerProfile:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - sectorPreference
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         sectorPreference:
 *           type: string
 *           example: IT
 *         experiences:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Experience'
 *         skills:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Skill'
 *         education:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Education'
 *         qualifications:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Qualification'
 * paths:
 *   /job-seekers:
 *     post:
 *       tags:
 *         - Job Seeker
 *       summary: Create a new job seeker
 *       description: Adds a new job seeker to the system.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobSeekerCreationAttributes'
 *       responses:
 *         201:
 *           description: Successfully created job seeker.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobSeekerProfile'
 *         400:
 *           description: Failed to create profile.
 */
router.post('/', jobSeekerController.createJobSeeker);

/**
 * @swagger
 * paths:
 *   /job-seekers:
 *     get:
 *       tags:
 *         - Job Seeker
 *       summary: Get job seeker by email
 *       description: Returns a single job seeker based on the email supplied.
 *       parameters:
 *         - in: query
 *           name: email
 *           schema:
 *             type: string
 *           required: true
 *           description: The email of the job seeker to retrieve.
 *       responses:
 *         200:
 *           description: A single job seeker.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobSeekerProfile'
 *         404:
 *           description: Job seeker not found.
 *         500:
 *           description: Getting the job seeker profile failed.
 */
router.get('/', jobSeekerController.getJobSeekerByEmail);


/**
 * @swagger
 * paths:
 *   /job-seekers/search:
 *     get:
 *       tags:
 *         - Job Seeker
 *       summary: Search for job seekers
 *       description: Returns a list of job seekers based on search criteria.
 *       parameters:
 *         - in: query
 *           name: sectorPreference
 *           schema:
 *             type: string
 *           description: The sector preference of the job seeker.
 *         - in: query
 *           name: minimumEducationLevel
 *           schema:
 *             type: string
 *             enum: ['GCSE', 'A-Level', 'Bsc', 'Msc', 'PhD']
 *           description: The minimum education level required.
 *         - in: query
 *           name: numberOfGCSEPasses
 *           schema:
 *             type: integer
 *           description: The minimum number of GCSE passes.
 *         - in: query
 *           name: professionalQualificationName
 *           schema:
 *             type: string
 *           description: Name of a required professional qualification.
 *         - in: query
 *           name: educationalQualificationName
 *           schema:
 *             type: string
 *           description: Name of a required educational qualification.
 *         - in: query
 *           name: skillName
 *           schema:
 *             type: string
 *           description: A specific skill name required.
 *         - in: query
 *           name: experienceRole
 *           schema:
 *             type: string
 *           description: A specific experience role required.
 *       responses:
 *         200:
 *           description: A list of job seekers that match the search criteria.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/JobSeeker'
 *         500:
 *           description: Error searching for job seekers.
 * components:
 *   schemas:
 *     JobSeeker:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         sectorPreference:
 *           type: string
 *           example: Technology
 *         version:
 *           type: integer
 *           example: 1
 *       required:
 *         - id
 *         - name
 *         - email
 *         - sectorPreference
 */
router.get('/search', search);

/**
 * @swagger
 * paths:
 *   /job-seekers/{jobSeekerId}:
 *     get:
 *       tags:
 *         - Job Seeker
 *       summary: Get a job seeker
 *       description: Returns a single job seeker based on the ID supplied.
 *       parameters:
 *         - in: path
 *           name: jobSeekerId
 *           schema:
 *             type: integer
 *           required: true
 *           description: The ID of the job seeker to retrieve.
 *       responses:
 *         200:
 *           description: A single job seeker.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobSeekerProfile'
 *         404:
 *           description: Job seeker not found.
 */
router.get('/:jobSeekerId', jobSeekerController.getJobSeeker);

/**
 * @swagger
 * /job-seekers/{jobSeekerId}/resume:
 *   get:
 *     tags:
 *       - Job Seeker
 *     summary: Generate a PDF resume for a job seeker
 *     description: Generates a PDF resume for a specific job seeker based on their profile and related details. This endpoint streams a PDF file directly to the client, which can be saved or displayed by the receiving software.
 *     parameters:
 *       - in: path
 *         name: jobSeekerId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the job seeker for whom the PDF resume is generated. This ID must correspond to an existing job seeker in the database.
 *     responses:
 *       200:
 *         description: PDF resume generated and streamed successfully.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *               description: The PDF data stream as a binary file.
 *       404:
 *         description: Job seeker not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job seeker not found."
 *       500:
 *         description: Failed to generate PDF resume.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to generate PDF resume."
 */
router.get('/:jobSeekerId/resume', jobSeekerController.generatePDFResume);

/**
 * @swagger
 * components:
 *   schemas:
 *     JobSeekerUpdateAttributes:
 *       type: object
 *       properties:
 *         sectorPreference:
 *           type: string
 *           example: IT
 *           description: The sector preference of the job seeker.
 *           nullable: false
 *           required: true
 * paths:
 *   /job-seekers/{jobSeekerId}:
 *     put:
 *       tags:
 *         - Job Seeker
 *       summary: Update a job seeker
 *       description: Updates a job seeker based on the ID supplied.
 *       parameters:
 *         - in: path
 *           name: jobSeekerId
 *           schema:
 *             type: integer
 *           required: true
 *           description: The ID of the job seeker to update.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobSeekerUpdateAttributes'
 *       responses:
 *         200:
 *           description: Job seeker updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobSeekerProfile'
 *         400:
 *           description: Updating the job seeker failed.
 */
router.put('/:jobSeekerId', jobSeekerController.updateJobSeeker);

/**
 * @swagger
 * paths:
 *   /job-seekers/{jobSeekerId}:
 *     delete:
 *       tags:
 *         - Job Seeker
 *       summary: Delete a job seeker
 *       description: Deletes a job seeker based on the ID supplied.
 *       parameters:
 *         - in: path
 *           name: jobSeekerId
 *           schema:
 *             type: integer
 *           required: true
 *           description: The ID of the job seeker to delete.
 *       responses:
 *         204:
 *           description: Job seeker deleted successfully.
 *         500:
 *           description: Deletion failed for job seeker.
 */
router.delete('/:jobSeekerId', jobSeekerController.deleteJobSeeker);

/**
 * @swagger
 * paths:
 *   /job-seekers/{jobSeekerId}/education/sync:
 *     post:
 *       tags:
 *         - Education
 *       summary: Synchronize education records for a job seeker
 *       description: Bulk update or create education records for a specific job seeker.
 *       parameters:
 *         - in: path
 *           name: jobSeekerId
 *           required: true
 *           schema:
 *             type: integer
 *           description: The ID of the job seeker to update education records for.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Education'
 *       responses:
 *         200:
 *           description: Updated jobSeeker profile with education records.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobSeekerProfile'
 *         500:
 *           description: Bulk update/create failed for experiences.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Bulk update/create failed for experiences.
 * components:
 *   schemas:
 *     Education:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Include for updates, exclude for new entries.
 *           example: 1
 *         level:
 *           type: string
 *           enum: [GCSE, A-Level, Bsc, Msc, PhD]
 *           example: Bsc
 *         fieldOfStudy:
 *           type: string
 *           example: Computer Science
 *         institution:
 *           type: string
 *           example: Tech University
 *         yearCompleted:
 *           type: integer
 *           example: 2020
 *         numPasses:
 *           type: integer
 *           description: Optional number of passes (e.g., for GCSE).
 *           example: 5
 *         levelRank:
 *           type: integer
 *           description: Optional rank of education level.
 *           example: 3
 *       required:
 *         - level
 *         - fieldOfStudy
 *         - institution
 *         - yearCompleted
 */
router.post('/:jobSeekerId/education/sync', bulkAddOrUpdateEducation);

/**
 * @swagger
 * paths:
 *   /job-seekers/{jobSeekerId}/experiences/sync:
 *     post:
 *       tags:
 *         - Experience
 *       summary: Synchronize experience records for a job seeker
 *       description: Bulk update or create experience records for a specific job seeker.
 *       parameters:
 *         - in: path
 *           name: jobSeekerId
 *           required: true
 *           schema:
 *             type: integer
 *           description: The ID of the job seeker whose experience records are to be updated.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Experience'
 *       responses:
 *         200:
 *           description: Updated jobSeeker profile with experience records.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobSeekerProfile'
 *         500:
 *           description: Failed to sync experiences.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Failed to sync experiences.
 * components:
 *   schemas:
 *     Experience:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Used for updating existing records, exclude for new entries.
 *           example: 1
 *         role:
 *           type: string
 *           example: Software Developer
 *         company:
 *           type: string
 *           example: Tech Innovations Inc.
 *         startDate:
 *           type: string
 *           format: date
 *           example: '2019-06-01'
 *         endDate:
 *           type: string
 *           format: date
 *           example: '2021-06-01'
 *         description:
 *           type: string
 *           example: Developed a cutting-edge tech solution.
 *       required:
 *         - role
 *         - company
 *         - startDate
 */
router.post('/:jobSeekerId/experiences/sync', syncExperiences);

/**
 * @swagger
 * paths:
 *   /job-seekers/{jobSeekerId}/qualifications/sync:
 *     post:
 *       tags:
 *         - Qualification
 *       summary: Synchronize qualification records for a job seeker
 *       description: Bulk update or create qualification records for a specific job seeker.
 *       parameters:
 *         - in: path
 *           name: jobSeekerId
 *           required: true
 *           schema:
 *             type: integer
 *           description: The ID of the job seeker whose qualification records are to be synchronized.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Qualification'
 *       responses:
 *         200:
 *           description: Updated jobSeeker profile with qualification records.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobSeekerProfile'
 *         500:
 *           description: Failed to sync qualifications.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Failed to sync qualifications.
 * components:
 *   schemas:
 *     Qualification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Optional for updating existing records, exclude for new entries.
 *           example: 1
 *         type:
 *           type: string
 *           enum: ['Professional', 'Educational']
 *           description: The type of qualification (Professional or Educational).
 *           example: Professional
 *         name:
 *           type: string
 *           example: Certified JavaScript Developer
 *         issuingOrganization:
 *           type: string
 *           example: JavaScript Institute
 *         dateObtained:
 *           type: string
 *           format: date
 *           example: '2020-08-01'
 *       required:
 *         - type
 *         - name
 *         - issuingOrganization
 *         - dateObtained
 */
router.post('/:jobSeekerId/qualifications/sync', syncQualifications);

/**
 * @swagger
 * paths:
 *   /job-seekers/{jobSeekerId}/skills/sync:
 *     post:
 *       tags:
 *         - Skills
 *       summary: Synchronize skill records for a job seeker
 *       description: Bulk update or create skill records for a specific job seeker.
 *       parameters:
 *         - in: path
 *           name: jobSeekerId
 *           required: true
 *           schema:
 *             type: integer
 *           description: The ID of the job seeker whose skill records are to be synchronized.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Skill'
 *       responses:
 *         200:
 *           description: Updated jobSeeker profile with education records.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/JobSeekerProfile'
 *         500:
 *           description: Failed to sync skills.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Failed to sync skills.
 * components:
 *   schemas:
 *     Skill:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Optional for updating existing records, exclude for new entries.
 *           example: 1
 *         name:
 *           type: string
 *           example: JavaScript
 *         proficiencyLevel:
 *           type: string
 *           description: The proficiency level of the skill.
 *           example: Expert
 *       required:
 *         - name
 *         - proficiencyLevel
 */
router.post('/:jobSeekerId/skills/sync', syncSkills);

export default router;
