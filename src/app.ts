import { checkDatabaseConnection } from './prisma/connect';
import { paymentRoutes } from './routes/payments.routes';
import { bookRoutes } from './routes/book.routes';
import { loanRoutes } from './routes/loan.routes';
import { userRoutes } from './routes/user.routes';
import seedAdminUser from './utilities/seed';
import express from 'express';

export const app = express()
const port = process.env.PORT || 8888;

async function startServer() {
    try {
        await checkDatabaseConnection();
        await seedAdminUser();

        app.use(express.json())
        app.use('/api/books', bookRoutes())
        app.use('/api/loans', loanRoutes())
        app.use('/api/users', userRoutes())
        app.use('/api/payments', paymentRoutes())

        app.listen(port, () => {
            console.log(`App is runing on PORT ${port}`)
        })
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();