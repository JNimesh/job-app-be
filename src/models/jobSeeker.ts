import { Model, DataTypes, Sequelize } from 'sequelize';

export class JobSeeker extends Model {
    declare id: number;
    declare name: string;
    declare email: string;
    declare sectorPreference: string;
    declare version: number;
}

export const initJobSeeker = (sequelize: Sequelize) => {
    JobSeeker.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        sectorPreference: {
            type: DataTypes.STRING
        },
        version: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        tableName: 'JobSeekers',
        timestamps: true, // Enable timestamps for createdAt and updatedAt
        version: 'version' // Enable optimistic locking using a version column
    });
};
