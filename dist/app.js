"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const wishRoutes_1 = __importDefault(require("./routes/wishRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Set the routes
app.use('/wishes', wishRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use((req, res) => {
    res.status(404).send("Not Found");
});
const port = 5000;
app.listen(port, () => {
    console.log(`server has started on port ${port}`);
});
module.exports = app;
