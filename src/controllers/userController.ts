import express, { Request, Response } from 'express';
import pool from '../db';
import { validateRecord } from '../routeHelpers';

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
export const addWish = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const userId = req.params.userId;
        const restaurantId = req.params.restaurantId;

        const checkUserId = await validateRecord("app_user", "user_id", userId);
        const checkRestaurantId = await validateRecord("restaurant", "restaurant_id", restaurantId);

        for (const check of [checkUserId, checkRestaurantId]) {
            if (!check.isValid) {
                res.status(check.status).json(`message: ${check.message}`);
                return;
            };
        };

        const query = 'INSERT INTO wish (user_id, restaurant_id, wish_comment, wish_priority) VALUES($1, $2, $3, $4) RETURNING *';
        const values = [userId, restaurantId, data.wish_comment, data.wish_priority];
        const result = await pool.query(query, values);
        const newWish = result.rows[0];

        res.status(201).json(newWish);

    } catch (err) {
        console.error("Error creating new wish", err.message);
    }
};