export interface SkillInput {
    name: string;
    proficiencyLevel: string; // Example values could be 'Beginner', 'Intermediate', 'Expert'
}

export interface Skill extends SkillInput {
    id?: number; // Optional for updating existing records
}
