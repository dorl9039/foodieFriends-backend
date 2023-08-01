import express, { Request, Response } from 'express';
import pool from '../db';
import { validateRecord, getYelpData, addRestaurant } from '../routeHelpers';


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
        console.log(restaurantData, wishData)
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
            const query = 'SELECT u.username FROM attendee AS a JOIN app_user AS u ON a.user_id = u.user_id JOIN visit AS v ON v.visit_id = a.visit_id WHERE v.visit_id = $1;'
            const values = [record.visit_id]
            const result = await pool.query(query, values)
            const attendees = result.rows;
            history.push({...record, attendees})
        }
        res.status(200).json(history);

    } catch (err) {
        console.error('Error fetching user history', err.message);
    }
};