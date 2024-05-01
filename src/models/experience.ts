import { Model, DataTypes, Sequelize } from 'sequelize';

export class Experience extends Model {
    declare id: number;
    declare jobSeekerId: number;
    declare role: string;
    declare company: string;
    declare startDate: Date;
    declare endDate: Date;
    declare description: string;
    declare version: number;
}

export const initExperience = (sequelize: Sequelize) => {
    Experience.init({
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
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        company: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: true // Allowing null for current positions
        },
        description: {
            type: DataTypes.TEXT
        },
        version: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        tableName: 'Experiences',
        timestamps: true,
        version: 'version'
    });
};
