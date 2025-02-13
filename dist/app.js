"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const connect_1 = require("./prisma/connect");
const book_routes_1 = require("./routes/book.routes");
const loan_routes_1 = require("./routes/loan.routes");
const user_routes_1 = require("./routes/user.routes");
exports.app = (0, express_1.default)();
(0, connect_1.checkDatabaseConnection)();
exports.app.use(express_1.default.json());
exports.app.use('/api/books', (0, book_routes_1.bookRoutes)());
exports.app.use('/api/loans', (0, loan_routes_1.loanRoutes)());
exports.app.use('/api/user', (0, user_routes_1.userRoutes)());
const port = process.env.PORT || 8888;
exports.app.listen(port, () => {
    console.log(`App is runing on PORT ${port}`);
});
