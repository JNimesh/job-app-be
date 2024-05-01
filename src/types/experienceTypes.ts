export interface ExperienceInput {
    role: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
}

export interface Experience extends ExperienceInput {
    id?: number; // Used for updating existing records
}
