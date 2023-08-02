import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import pool from '../db';
import { validateRecord, getYelpData, addRestaurant, getAttendees } from '../routeHelpers';


// Display list of wishes for a user
export const getWishlist = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        
        const checkUserId = await validateRecord("app_user", "user_id", userId)
        if (!checkUserId.isValid) {
            res.status(checkUserId.status).json(`message: ${checkUserId.message}`);
        }

        const query = 'SELECT * FROM wish WHERE user_id = $1';
        const values = [userId];
        const result = await pool.query(query, values);
        const wishlist = result.rows;
        
        res.status(200).json(wishlist);

    } catch (err) {
        console.error('Error fetching user wishlist', err.message);
    }
};

// Add a wish to wishlist
// req will be retrieval from MapGL (object of {name, address, lng, lat etc} {wish_comment, wish_priority})

export const addWish = async (req: Request, res: Response) => {
    try {
        const {restaurantData, wishData} = req.body;
        const userId = req.params.userId;
        // Check that the userId is valid
        const checkUserId = await validateRecord("app_user", "user_id", userId);
        if (!checkUserId.isValid) {
            res.status(checkUserId.status).json(`message: ${checkUserId.message}`);
            return;
        };

        // Make Yelp API call for additional restaurant info
        const newRestaurantData = await getYelpData(restaurantData)
        // Add restaurant to db if it's not there
        const restaurantId = await addRestaurant(newRestaurantData)
        // Create new wish
        const query = 'INSERT INTO wish (user_id, restaurant_id, restaurant_name, wish_comment, wish_priority) VALUES($1, $2, $3, $4, $5) RETURNING *';
        const values = [userId, restaurantId, restaurantData.restaurantName, wishData.wish_comment, wishData.wish_priority];
        const result = await pool.query(query, values);
        const newWish = result.rows[0];

        res.status(201).json(newWish);

    } catch (err) {
        console.error("Error creating new wish:", err.message);
    }
};


// Get user's history of visits
export const getHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        
        const checkUserId = await validateRecord("app_user", "user_id", userId)
        if (!checkUserId.isValid) {
            res.status(checkUserId.status).json(`message: ${checkUserId.message}`);
        }
        // get list of attendee records
        const query = 'SELECT v.visit_id, v.restaurant_id, v.restaurant_name, v.visit_date, a.user_id, a.visit_comment FROM attendee AS a JOIN visit AS v ON v.visit_id = a.visit_id WHERE a.user_id = $1;';
        const values = [userId];
        const result = await pool.query(query, values);
        const records = result.rows;
        
        const history = []
        for (const record of records) {
            const attendees = await getAttendees(record.visit_id)
            history.push({...record, attendees})
        }
        res.status(200).json(history);

    } catch (err) {
        console.error('Error fetching user history', err.message);
    }
};


// Get a specific visit record from a user's history
export const getVisit = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        // Validate userId exists
        const checkUserId = await validateRecord("app_user", "user_id", userId)
        if (!checkUserId.isValid) {
            res.status(checkUserId.status).json(`message: ${checkUserId.message}`);
        }

        const visitId = req.params.visitId
        // Validate visitId exists
        const checkVisitId = await validateRecord("attendee", "visit_id", visitId)
        if (!checkUserId.isValid) {
            res.status(checkUserId.status).json(`message: ${checkUserId.message}`);
        }

        // get visit record
        const query = 'SELECT v.visit_id, v.restaurant_id, v.restaurant_name, v.visit_date, a.user_id, a.visit_comment FROM attendee AS a JOIN visit AS v ON v.visit_id = a.visit_id WHERE a.user_id = $1 AND v.visit_id = $2;';
        const values = [userId, visitId];
        const result = await pool.query(query, values);
        const records = result.rows[0];
        const attendees = await getAttendees(visitId)
        const vistData = {...records, attendees}
        
        res.status(200).json(vistData);

    } catch (err) {
        console.error('Error fetching user history', err.message);
    }
};


// Delete a specific visit from a user's history
export const deleteVisit = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        // Validate userId exists
        const checkUserId = await validateRecord("app_user", "user_id", userId)
        if (!checkUserId.isValid) {
            res.status(checkUserId.status).json(`message: ${checkUserId.message}`);
        }

        const visitId = req.params.visitId
        // Validate visitId exists
        const checkVisitId = await validateRecord("attendee", "visit_id", visitId)
        if (!checkUserId.isValid) {
            res.status(checkUserId.status).json(`message: ${checkUserId.message}`);
        }
        const query = 'DELETE FROM attendee WHERE user_id = $1 AND visit_id = $2;';
        const values = [userId, visitId];
        await pool.query(query, values);

        res.status(200).json(`Visit ${visitId} successfully deleted`);

    } catch (err) {
        console.error('Error fetching user history', err.message);
    }
}

export interface visitData {
    visitId?: number,
    restaurantId: string,
    restaurantName: string, 
    visitDate: string,
    visitComment: string,
    attendees: Array<object>
};
// Create a visit for a user
// Parameter: userId, req.body: an instance of visitData
export const createVisit = async (req: Request, res: Response) => {
    try {
        //Create a visit record first
        const visitData = req.body;
        const userId = req.params.userId;
        // Check that the userId is valid
        const checkUserId = await validateRecord("app_user", "user_id", userId);
        if (!checkUserId.isValid) {
            res.status(checkUserId.status).json(`message: ${checkUserId.message}`);
            return;
        };
    
        const query = 'INSERT INTO visit (restaurant_id, restaurant_name, visit_date) VALUES($1, $2, $3) RETURNING *';
        const values = [visitData.restaurantId, visitData.restaurantName, visitData.visitDate];
        const result = await pool.query(query, values);
        const newVisit = result.rows[0];
    
        for (const user of visitData.attendees) {
            // Validate attendee is valid app_user
            const checkAttendeeUserId = await validateRecord("app_user", "user_id", user.user_id);
            if (!checkAttendeeUserId.isValid) {
                res.status(checkAttendeeUserId.status).json(`message: ${checkAttendeeUserId.message}`);
                return;
            };
            // Create attendee record for each visit attendee
            let attendeeQuery: string;
            let attendeeValues: Array<string>
            // Insert visit comment for user creating the record
            if (user.user_id == userId) {
                attendeeQuery = 'INSERT INTO attendee (user_id, visit_id, visit_comment) VALUES($1, $2, $3)';
                attendeeValues = [user.user_id, newVisit.visit_id, visitData.visitComment];
            } else {        
                attendeeQuery = 'INSERT INTO attendee (user_id, visit_id) VALUES($1, $2)';
                attendeeValues = [user.user_id, newVisit.visit_id];
            };
            try {
                await pool.query(attendeeQuery, attendeeValues)
            } catch (err) {
                console.error("Error in creating attendee record when creating new visit", err)
            };
        };
        const newVisitRecord = {
            ...newVisit,
            user_id: userId,
            visit_comment: visitData.visitComment,
            attendees: visitData.attendees
        };  
        res.status(201).json(newVisitRecord);

    } catch (err) {
        console.error('Error in creating new visit', err)
    };
}

//Params: userId, visitId. Req.body: visit_comment
export const editAttendeeComment = async (req: Request, res: Response) => {
    try {
        const attendeeRecord = req.body
        //Validate user in db
        const userId = req.params.userId;
        const checkUserId = await validateRecord("app_user", "user_id", userId);
        if (!checkUserId.isValid) {
            res.status(checkUserId.status).json(`message: ${checkUserId.message}`);
            return;
        };

        //Validate visit
        const visitId = req.params.visitId;
        const checkVisitId = await validateRecord("visit", "visit_id", visitId);
        if (!checkVisitId.isValid) {
            res.status(checkVisitId.status).json(`message: ${checkVisitId.message}`);
            return;
        };

        //Validate user was an attendee of visit
        const checkAttendeeQuery = 'SELECT * FROM attendee WHERE user_id = $1 AND visit_id = $2';
        const checkAttendeeValues = [userId, visitId]
        const checkAttendeeResult = await pool.query(checkAttendeeQuery, checkAttendeeValues)
        if (checkAttendeeResult.rows.length < 1) {
            return {isValid: false, status: 404, message: `attendee with id ${userId} for visit ${visitId} not found`};
        }
        //Update attendee record
        let query = 'UPDATE attendee SET visit_comment = $1 WHERE visit_id = $2 and user_id = $3 RETURNING *';
        const values = [attendeeRecord.visit_comment, visitId, userId]

        
        const result = await pool.query(query, values);
        const updatedAttendeeRecord = result.rows[0]
        res.status(200).json(updatedAttendeeRecord);

    } catch (err) {
        console.error(err.message);
    }
}

//Params: userId, visitId. Req.body: username of attendee
export const editVisitAttendees = async (req: Request, res: Response) => {
        try { 
            const newAttendee = req.body
            //Validate user in db
            const userId = req.params.userId;
            const checkUserId = await validateRecord("app_user", "user_id", userId);
            if (!checkUserId.isValid) {
                res.status(checkUserId.status).json(`message: ${checkUserId.message}`);
                return;
            };

            //Validate visit
            const visitId = req.params.visitId;
            const checkVisitId = await validateRecord("visit", "visit_id", visitId);
            if (!checkVisitId.isValid) {
                res.status(checkVisitId.status).json(`message: ${checkVisitId.message}`);
                return;
            };

            //Validate user was an attendee of visit and get list of all visit attendees
            const attendees = await getAttendees(visitId)
            if (attendees.length < 1) {
                return {isValid: false, status: 404, message: `user with id ${userId} was not an attendee for visit ${visitId}`};
            }
            
            const oldAttendeesUsernames = attendees.map(user => user.username)
            if (!oldAttendeesUsernames.includes(newAttendee.username)) {
                // Get attendee's id
                const attendeeIdQuery = 'SELECT user_id FROM app_user WHERE username = $1';
                const attendeeIdValues = [newAttendee.username]
                const attendeeIdresult = await pool.query(attendeeIdQuery, attendeeIdValues);
                const newAttendeeId = attendeeIdresult.rows[0].user_id

                // create new attendee record
                const newAttendeeQuery = 'INSERT INTO attendee (visit_id, user_id) VALUES ($1, $2)';
                const newAttendeeValues = [visitId, newAttendeeId]
                await pool.query(newAttendeeQuery, newAttendeeValues)
                attendees.push({username: newAttendee.username, user_id: newAttendeeId})
            }
            res.status(200).json(attendees)

        } catch (err) {
            console.error("Error editing visit attendees", err)
        }
}