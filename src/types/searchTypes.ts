export interface SearchParams {
    sectorPreference?: string;
    minimumEducationLevel?: 'GCSE' | 'A-Level'| 'BSc'| 'MSc'|  'PhD';
    numberOfGCSEPasses?: number;
    professionalQualificationName?: string;
    educationalQualificationName?: string;
    skillName?: string;
    experienceRole?: string;
}


