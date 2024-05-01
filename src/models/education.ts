import { Model, DataTypes, Sequelize } from 'sequelize';

export class Education extends Model {
    declare id: number;
    declare jobSeekerId: number;
    declare level: 'GCSE' | 'A-Level'| 'BSc'| 'MSc'|  'PhD';
    declare levelRank: number;
    declare fieldOfStudy: string;
    declare institution: string;
    declare yearCompleted: number;
    declare numPasses: number;
    declare version: number;
}

export const initEducation = (sequelize: Sequelize) => {
    Education.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        jobSeekerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'JobSeekers',
                key: 'id'
            }
        },
        level: {
            type: DataTypes.ENUM,
            values: ['GCSE', 'A-Level', 'BSc', 'MSc', 'PhD'],
            allowNull: false
        },
        levelRank: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fieldOfStudy: {
            type: DataTypes.STRING,
            allowNull: false
        },
        institution: {
            type: DataTypes.STRING,
            allowNull: false
        },
        yearCompleted: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        numPasses: {
            type: DataTypes.INTEGER,
            allowNull: true // Assuming not all job seekers will have GCSEs
        },
        version: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        tableName: 'Education',
        timestamps: true,
        version: 'version'
    });
};

const educationLevelMapping: Record<string, number> = {
    'GCSE': 1,
    'A-Level': 2,
    'Bsc': 3,
    'Msc': 4,
    'PhD': 5
};

// Function to convert education level to its numerical rank
export const getEducationLevelRank = (level: string): number => educationLevelMapping[level] || 0;

