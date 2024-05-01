export interface Education {
    id?: number; // Include for updates, exclude for new entries
    level: 'GCSE' | 'A-Level'| 'Bsc'| 'Msc'|  'PhD';
    fieldOfStudy: string;
    institution: string;
    yearCompleted: number;
    numPasses?: number; // Optional
    levelRank?: number; // Optional
}
