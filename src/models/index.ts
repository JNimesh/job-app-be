import { Sequelize } from 'sequelize';
import { initJobSeeker, JobSeeker } from './jobSeeker';
import { initEducation, Education } from './education';
import { initSkill, Skill } from './skill';
import { initExperience, Experience } from './experience';
import { initQualification, Qualification } from './qualification';

// Setup Sequelize to use SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../storage.sqlite3',
    logging: console.log,
});

// Initialize models
initJobSeeker(sequelize);
initEducation(sequelize);
initSkill(sequelize);
initExperience(sequelize);
initQualification(sequelize);

// Define associations
JobSeeker.hasMany(Education, { foreignKey: 'jobSeekerId', as: 'education' });
JobSeeker.hasMany(Skill, { foreignKey: 'jobSeekerId', as: 'skills' });
JobSeeker.hasMany(Experience, { foreignKey: 'jobSeekerId', as: 'experiences' });
JobSeeker.hasMany(Qualification, { foreignKey: 'jobSeekerId', as: 'qualifications' });

Education.belongsTo(JobSeeker, { foreignKey: 'jobSeekerId', as: 'jobSeeker' });
Skill.belongsTo(JobSeeker, { foreignKey: 'jobSeekerId', as: 'jobSeeker' });
Experience.belongsTo(JobSeeker, { foreignKey: 'jobSeekerId', as: 'jobSeeker' });
Qualification.belongsTo(JobSeeker, { foreignKey: 'jobSeekerId', as: 'jobSeeker' });


export {
    sequelize,
    JobSeeker,
    Education,
    Skill,
    Experience,
    Qualification
};
