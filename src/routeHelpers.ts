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

interface restaurantData {
    id?: string,
    restaurantName: string, 
    address1: string, 
    city: string, 
    state: string, 
    country: string,
    longitude?: number,
    latitude?: number,
    cuisine?: string,
    priceRange?: string,
};

// Mapbox API call to get restaurant name and address


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
        country: data.country,
    };

    try {
        const matchResponse: AxiosResponse = await axios.get(yelpMatchUrl, { headers, params:matchParams });
        const restaurantId = matchResponse.data.businesses[0].id;

        const byIdResponse: AxiosResponse = await axios.get(`${yelpByIdUrl}/${restaurantId}`, {headers});
        const categories = byIdResponse.data.categories.map(obj => obj.title);
        const cuisine = categories.join(', ')

        const restaurantData = {
            id: matchResponse.data.businesses[0].id,
            ...matchParams,
            longitude: matchResponse.data.businesses[0].coordinates.longitude,
            latitude: matchResponse.data.businesses[0].coordinates.latitude,
            cuisine: cuisine,
            priceRange: byIdResponse.data.price
        };
        return restaurantData;

    } catch (err) {
        console.error('Error in findRestaurant', err);
    };
};

// const data = {
//     restaurantName :'Cloud & Spirits',
//     address1: '795 Main St',
//     city: 'Cambridge',
//     state :'MA',
//     country: 'US',
// }

// getYelpData(data).then( res => {
//    const newData = res;
//    console.log(newData)
// })
