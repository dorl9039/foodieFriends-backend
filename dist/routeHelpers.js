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
exports.validateRecord = void 0;
const db_1 = __importDefault(require("./db"));
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
