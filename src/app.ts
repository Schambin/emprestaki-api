import express from 'express';
import { bookRoutes } from './routes/book.routes';
import { loanRoutes } from './routes/loan.routes';
import { checkDatabaseConnection } from './prisma/connect';

export const app = express()

checkDatabaseConnection();

app.use(express.json())
app.use('/api/books', bookRoutes())
app.use('/api/loans', loanRoutes())

const port = process.env.PORT || 8888
app.listen(port, () => {
    console.log(`App is runing on PORT ${port}`)
})