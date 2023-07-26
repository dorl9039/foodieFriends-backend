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
exports.addWish = exports.getWishlist = void 0;
const db_1 = __importDefault(require("../db"));
const routeHelpers_1 = require("../routeHelpers");
// Display list of wishes for a user
const getWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const checkUserId = yield (0, routeHelpers_1.validateRecord)("app_user", "user_id", userId);
        if (!checkUserId.isValid) {
            res.status(checkUserId.status).json(`message: ${checkUserId.message}`);
        }
        const query = 'SELECT * FROM wish WHERE user_id = $1';
        const values = [userId];
        const result = yield db_1.default.query(query, values);
        const wishlist = result.rows;
        res.status(200).json(wishlist);
    }
    catch (err) {
        console.error('Error fetching user wishlist', err.message);
    }
});
exports.getWishlist = getWishlist;
// Add a wish to wishlist
const addWish = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const userId = req.params.userId;
        const restaurantId = req.params.restaurantId;
        const checkUserId = yield (0, routeHelpers_1.validateRecord)("app_user", "user_id", userId);
        const checkRestaurantId = yield (0, routeHelpers_1.validateRecord)("restaurant", "restaurant_id", restaurantId);
        for (const check of [checkUserId, checkRestaurantId]) {
            if (!check.isValid) {
                res.status(check.status).json(`message: ${check.message}`);
                return;
            }
            ;
        }
        ;
        const query = 'INSERT INTO wish (user_id, restaurant_id, wish_comment, wish_priority) VALUES($1, $2, $3, $4) RETURNING *';
        const values = [userId, restaurantId, data.wish_comment, data.wish_priority];
        const result = yield db_1.default.query(query, values);
        const newWish = result.rows[0];
        res.status(201).json(newWish);
    }
    catch (err) {
        console.error("Error creating new wish", err.message);
    }
});
exports.addWish = addWish;
