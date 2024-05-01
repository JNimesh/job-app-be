import { Request, Response } from 'express';
import { searchJobSeekers } from '../services/searchService';
import {SearchParams} from "../types/searchTypes";

export const search = async (req: Request, res: Response) => {
    try {
        const results = await searchJobSeekers(req.query as SearchParams);
        res.json(results);
    } catch (error) {
        res.status(500).send({ message: 'Error searching for job seekers', error: 'Failed to search job seekers' });
    }
};
