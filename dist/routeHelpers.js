"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYelpData = exports.validateRecord = void 0;
const db_1 = __importDefault(require("./db"));
require("dotenv/config");
const axios_1 = __importDefault(require("axios"));
const validateRecord = (table, idType, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Number(id)) {
        return { isValid: false, status: 400, message: `id ${id} is invalid` };
    }
    ;
    const result = yield db_1.default.query(`SELECT * FROM ${table} WHERE ${idType} = $1`, [id]);
    if (result.rows.length < 1) {
        return { isValid: false, status: 404, message: `${table} with id ${id} was not found` };
    }
    ;
    return { isValid: true, status: null, message: null };
});
exports.validateRecord = validateRecord;
;
// Mapbox API call to get restaurant name and address
// API call to Yelp (plugging in restaurant name and address) to get Yelp id
const getYelpData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const yelpMatchUrl = 'https://api.yelp.com/v3/businesses/matches';
    const yelpByIdUrl = 'https://api.yelp.com/v3/businesses';
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
        const matchResponse = yield axios_1.default.get(yelpMatchUrl, { headers, params: matchParams });
        const restaurantId = matchResponse.data.businesses[0].id;
        const byIdResponse = yield axios_1.default.get(`${yelpByIdUrl}/${restaurantId}`, { headers });
        const categories = byIdResponse.data.categories.map(obj => obj.title);
        const cuisine = categories.join(', ');
        const restaurantData = Object.assign(Object.assign({ id: matchResponse.data.businesses[0].id }, matchParams), { longitude: matchResponse.data.businesses[0].coordinates.longitude, latitude: matchResponse.data.businesses[0].coordinates.latitude, cuisine: cuisine, priceRange: byIdResponse.data.price });
        return restaurantData;
    }
    catch (err) {
        console.error('Error in findRestaurant', err);
    }
    ;
});
exports.getYelpData = getYelpData;
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
