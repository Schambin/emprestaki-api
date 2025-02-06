import express from 'express';
import { bookRoutes } from './routes/book.routes';
import { checkDatabaseConnection } from './prisma/connect';

export const app = express()

checkDatabaseConnection();

app.use(express.json())
app.use('/api/books', bookRoutes())

const port = process.env.PORT || 8888
app.listen(port, () => {
    console.log(`App is runing on PORT ${port}`)
})