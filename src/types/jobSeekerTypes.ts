import {Skill} from "./skillTypes";
import {Education, Experience, Qualification} from "../models";

export interface JobSeekerCreationAttributes {
    name: string;
    email: string;
    sectorPreference: string;
}

export interface JobSeekerUpdateAttributes {
    sectorPreference?: string;
}

export interface JobSeekerProfile extends JobSeekerCreationAttributes {
    id: number;
    skills: Skill[];
    experiences: Experience[];
    qualifications: Qualification[];
    educationDetails: Education[];
}
