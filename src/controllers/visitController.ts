import { Request, Response } from 'express';
import pool from '../db';
import { validateRecord, getAttendees } from '../routeHelpers';

// Get all visit records in db
export const getAllVisits = async (req: Request, res: Response) => {
    try {
        const query = 'SELECT v.visit_id, v.restaurant_id, v.restaurant_name, v.visit_date, a.user_id, a.visit_comment FROM attendee AS a JOIN visit AS v ON v.visit_id = a.visit_id';
        const result = await pool.query(query);
        const records = result.rows;
        
        // Get list of attendees for each visit
        const allVisits = [];
        for (const record of records) {
            const attendees = await getAttendees(record.visit_id);
            allVisits.push({...record, attendees});
        }
        res.status(200).json(allVisits);

    } catch (err) {
        console.error('Error fetching all visits', err.message);
    }
};
