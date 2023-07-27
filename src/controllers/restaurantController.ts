import express, { Request, Response } from 'express';
import pool from '../db';
import { validateRecord } from '../routeHelpers';
import 'dotenv/config';
console.log(process.env.YELP_API_KEY)
import axios, { AxiosResponse } from 'axios';

// Mapbox API call to get restaurant name and address


// API call to Yelp (plugging in restaurant name and address) to get Yelp id
export const findRestaurant = async (rest_name: string, address1: string, city: string, state: string, country: string) => {
    const yelpUrl = 'https://api.yelp.com/v3/businesses/matches';
    const headers = {
        'Authorization': `Bearer ${process.env.YELP_API_TOKEN}`,
        'accept': 'application/json'
    };
    const params = {
        name: rest_name,
        address1,
        city,
        state,
        country,
    };

    try {
        const response: AxiosResponse = await axios.get(yelpUrl, { headers, params });
        return response.data.businesses[0].id;
    } catch (err) {
        console.error('Error in findRestaurant', err)
    }
};

// Check if Yelp restaurant id is already in db

// Add restaurant to db