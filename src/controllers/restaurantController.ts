import { Request, Response } from 'express';
import pool from '../db';
import {restaurantData} from '../routeHelpers'

export const getRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.params.restaurantId;
        const result = await pool.query(`SELECT * FROM restaurant WHERE restaurant_id = $1`, [restaurantId]);
        console.log(result.rows)
        if (result.rows.length < 1) {
            res.status(404).json(`message: Restaurant with id ${restaurantId} was not found`);
            return;
        }
        const restaurant = result.rows[0];
        res.status(200).json(restaurant);
    } catch (err) {
        console.error("Error in getting restaurant:", err.message)
    };
};

