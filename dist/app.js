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
exports.app = void 0;
const connect_1 = require("./prisma/connect");
const payments_routes_1 = require("./routes/payments.routes");
const book_routes_1 = require("./routes/book.routes");
const loan_routes_1 = require("./routes/loan.routes");
const user_routes_1 = require("./routes/user.routes");
const seed_1 = __importDefault(require("./utilities/seed"));
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const port = process.env.PORT || 8888;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, connect_1.checkDatabaseConnection)();
            yield (0, seed_1.default)();
            exports.app.use(express_1.default.json());
            exports.app.use('/api/books', (0, book_routes_1.bookRoutes)());
            exports.app.use('/api/loans', (0, loan_routes_1.loanRoutes)());
            exports.app.use('/api/users', (0, user_routes_1.userRoutes)());
            exports.app.use('/api/payments', (0, payments_routes_1.paymentRoutes)());
            exports.app.listen(port, () => {
                console.log(`App is runing on PORT ${port}`);
            });
        }
        catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    });
}
startServer();
