import { Request, Response } from 'express';
import pool from '../db';

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

// Add Yelp restaurant to db if it's not already in there
export const addRestaurant = async (req: Request, res: Response) => {
    const data = req.body
    const result = await pool.query(`SELECT * FROM restaurant WHERE restaurant_id = $1`, [data.id]);
    const isValid = result.rows.length < 1 ? false: true;

    // add to db if restaurant not already present
    if (!isValid) {
        try {
            const query = 'INSERT INTO restaurant(restaurant_id, restaurant_name, address_line1, address_city, address_state, address_country, longitude, latitude, cuisine, price_range) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'
            const values = Object.values(data)
            await pool.query(query, values);

            res.status(201).json(`restaurant_id: ${data.id}`)

        } catch (err) {
            console.error('Error adding restaurant to table', err);
        };
    } else {    
        res.status(200).json(`restaurant_id: ${data.id}`)
    };
};
