import { checkDatabaseConnection } from './prisma/connect';
import { paymentRoutes } from './routes/payments.routes';
import { bookRoutes } from './routes/book.routes';
import { loanRoutes } from './routes/loan.routes';
import { userRoutes } from './routes/user.routes';
import seedAdminUser from './utilities/seed';
import express from 'express';
import { swaggerSpec, swaggerUiOptions } from "./swagger";
import swaggerUi from "swagger-ui-express";

export const app = express()
const port = process.env.PORT || 8888;

async function startServer() {
    try {
        app.use("/api-docs",
            swaggerUi.serve,
            swaggerUi.setup(swaggerSpec, swaggerUiOptions)
        );
        await checkDatabaseConnection();
        await seedAdminUser();

        app.use(express.json())
        app.use('/api/books', bookRoutes())
        app.use('/api/loans', loanRoutes())
        app.use('/api/users', userRoutes())
        app.use('/api/payments', paymentRoutes())

        app.listen(port, () => {
            console.log(`App is runing on PORT ${port}`)
            console.log(`Documentação disponível em http://localhost:${port}/api-docs`);
        })
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();