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
exports.deleteWish = exports.editWish = exports.getWish = void 0;
const db_1 = __importDefault(require("../db"));
const routeHelpers_1 = require("../routeHelpers");
// Get a wish
const getWish = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wishId = req.params.wishId;
        if (!Number(wishId)) {
            res.status(400).json(`message: id ${wishId} is invalid`);
            return;
        }
        ;
        const query = 'SELECT * FROM wish WHERE wish_id = $1';
        const values = [wishId];
        const result = yield db_1.default.query(query, values);
        if (result.rows.length < 1) {
            res.status(404).json(`message: Wish with id ${wishId} was not found`);
            return;
        }
        ;
        const wish = result.rows[0];
        res.status(200).json(wish);
    }
    catch (err) {
        console.error(err.message);
    }
});
exports.getWish = getWish;
// Update a wish
const editWish = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wishId = req.params.wishId;
        const checkWishId = yield (0, routeHelpers_1.validateRecord)("wish", "wish_id", wishId);
        if (!checkWishId.isValid) {
            res.status(checkWishId.status).json(`message: ${checkWishId.message}`);
            return;
        }
        ;
        const { wish_comment, wish_priority } = req.body;
        let query = 'UPDATE wish SET ';
        const values = [];
        if (wish_comment !== undefined) {
            query += `wish_comment = $${values.length + 1}`;
            values.push(wish_comment);
        }
        if (wish_priority !== undefined) {
            if (values.length > 0) {
                query += ', ';
            }
            query += `wish_priority = $${values.length + 1}`;
            values.push(wish_priority);
        }
        query += ` WHERE wish_id = $${values.length + 1}`;
        values.push(wishId);
        yield db_1.default.query(query, values);
        res.status(200).json(`Wish ${wishId} successfully updated`);
    }
    catch (err) {
        console.error(err.message);
    }
});
exports.editWish = editWish;
// Delete a wish
const deleteWish = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wishId = req.params.wishId;
        const checkWishId = yield (0, routeHelpers_1.validateRecord)("wish", "wish_id", wishId);
        if (!checkWishId.isValid) {
            res.status(checkWishId.status).json(`message: ${checkWishId.message}`);
            return;
        }
        ;
        const query = 'DELETE FROM wish WHERE wish_id = $1';
        const values = [wishId];
        yield db_1.default.query(query, values);
        res.status(200).json(`Wish ${wishId} successfully deleted`);
    }
    catch (err) {
        console.error(err.message);
    }
});
exports.deleteWish = deleteWish;
