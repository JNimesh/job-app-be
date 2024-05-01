import { Model, DataTypes, Sequelize } from 'sequelize';

export class Qualification extends Model {
    declare id: number;
    declare jobSeekerId: number;
    declare type: 'Educational' | 'Professional';
    declare name: string;
    declare issuingOrganization: string;
    declare dateObtained: Date;
    declare version: number;
}

export const initQualification = (sequelize: Sequelize) => {
    Qualification.init({
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
        type: {
            type: DataTypes.ENUM,
            values: ['Educational', 'Professional'],
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        issuingOrganization: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateObtained: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        version: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        tableName: 'Qualifications',
        timestamps: true,
        version: 'version'
    });
};
