export interface QualificationInput {
    type: 'Professional' | 'Educational';
    name: string;
    issuingOrganization: string;
    dateObtained: Date;
}

export interface Qualification extends QualificationInput {
    id?: number; // Optional for updating existing records
}
