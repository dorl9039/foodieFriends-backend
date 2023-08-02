import pool from './db';
import 'dotenv/config';
import axios, { AxiosResponse } from 'axios';

export const validateRecord = async (table: string, idType: string, id: string) => {
    if (!Number(id)) {
        return {isValid: false, status: 400, message: `id ${id} is invalid`};
    };

    const result = await pool.query(`SELECT * FROM ${table} WHERE ${idType} = $1`, [id]);
    
    if (result.rows.length < 1) {
        return {isValid: false, status: 404, message: `${table} with id ${id} was not found`};
    };

    return {isValid: true, status: null, message: null}
};

// External API calls

export interface restaurantData {
    id?: string,
    restaurantName: string, 
    address1: string, 
    city: string, 
    state: string, 
    country: string,
    longitude: number,
    latitude: number,
    cuisine?: string,
    priceRange?: string
};


// API call to Yelp (plugging in restaurant name and address) to get Yelp id
export const getYelpData = async (data: restaurantData) => {
    const yelpMatchUrl = 'https://api.yelp.com/v3/businesses/matches';
    const yelpByIdUrl = 'https://api.yelp.com/v3/businesses'
    const headers = {
        'Authorization': `Bearer ${process.env.YELP_API_TOKEN}`,
        'accept': 'application/json'
    };
    const matchParams = {
        name: data.restaurantName,
        address1: data.address1,
        city: data.city,
        state: data.state,
        country: data.country
    };

    try {
        const matchResponse: AxiosResponse = await axios.get(yelpMatchUrl, { headers, params:matchParams });
        const restaurantId = matchResponse.data.businesses[0].id;

        const byIdResponse: AxiosResponse = await axios.get(`${yelpByIdUrl}/${restaurantId}`, {headers});
        const categories = byIdResponse.data.categories.map(obj => obj.title);
        const cuisine = categories.join(', ')

        const restaurantData = {
            id: matchResponse.data.businesses[0].id,
            ...data,
            cuisine: cuisine,
            priceRange: byIdResponse.data.price
        };
        return restaurantData;

    } catch (err) {
        console.error('Error in findRestaurant', err);
    };
};

// Add Yelp restaurant to db if it's not already in there
export const addRestaurant = async (restaurantData:restaurantData) => {
    const result = await pool.query(`SELECT * FROM restaurant WHERE restaurant_id = $1`, [restaurantData.id]);
    const isValid = result.rows.length < 1 ? false: true;

    if (!isValid) {
        const query = 'INSERT INTO restaurant(restaurant_id, restaurant_name, address_line1, address_city, address_state, address_country, longitude, latitude, cuisine, price_range) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
        const values = Object.values(restaurantData);
        await pool.query(query, values);
    }
    // console.log(restaurantData.id)
    return restaurantData.id;
};


export const getAttendees = async (visitId) => {
    const query = 'SELECT u.username FROM attendee AS a JOIN app_user AS u ON a.user_id = u.user_id JOIN visit AS v ON v.visit_id = a.visit_id WHERE v.visit_id = $1;'
    const values = [visitId]
    const result = await pool.query(query, values)
    const attendees = result.rows.map(attendee => attendee.username);
    return attendees
}