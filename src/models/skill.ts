import { Model, DataTypes, Sequelize } from 'sequelize';

export class Skill extends Model {
    declare id: number;
    declare jobSeekerId: number;
    declare name: string;
    declare proficiencyLevel: string;
    declare version: number;
}

export const initSkill = (sequelize: Sequelize) => {
    Skill.init({
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
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        proficiencyLevel: {
            type: DataTypes.STRING
        },
        version: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        tableName: 'Skills',
        timestamps: true,
        version: 'version'
    });
};
