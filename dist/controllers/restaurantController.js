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
exports.addRestaurant = exports.getRestaurant = void 0;
const db_1 = __importDefault(require("../db"));
const getRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.restaurantId;
        console.log(restaurantId);
        const result = yield db_1.default.query(`SELECT * FROM restaurant WHERE restaurant_id = $1`, [restaurantId]);
        console.log(result.rows);
        if (result.rows.length < 1) {
            res.status(404).json(`message: Restaurant with id ${restaurantId} was not found`);
            return;
        }
        const restaurant = result.rows[0];
        res.status(200).json(restaurant);
    }
    catch (err) {
        console.error("Error in getting restaurant:", err.message);
    }
    ;
});
exports.getRestaurant = getRestaurant;
// Add Yelp restaurant to db if it's not already in there
const addRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const result = yield db_1.default.query(`SELECT * FROM restaurant WHERE restaurant_id = $1`, [data.id]);
    const isValid = result.rows.length < 1 ? false : true;
    // add to db if restaurant not already present
    if (!isValid) {
        try {
            const query = 'INSERT INTO restaurant(restaurant_id, restaurant_name, address_line1, address_city, address_state, address_country, longitude, latitude, cuisine, price_range) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
            const values = Object.values(data);
            yield db_1.default.query(query, values);
            res.status(201).json(`restaurant_id: ${data.id}`);
        }
        catch (err) {
            console.error('Error adding restaurant to table', err);
        }
        ;
    }
    else {
        res.status(200).json(`restaurant_id: ${data.id}`);
    }
    ;
});
exports.addRestaurant = addRestaurant;
