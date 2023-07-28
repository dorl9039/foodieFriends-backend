import express, { Request, Response } from 'express';
import cors from 'cors';
import wishRoutes from './routes/wishRoutes';
import userRoutes from './routes/userRoutes';
import restaurantRoutes from './routes/restaurantRoutes';


const app = express();

app.use(cors());
app.use(express.json());


// Set the routes
app.use('/wishes', wishRoutes);
app.use('/users', userRoutes);
app.use('/restaurants', restaurantRoutes);

app.use((req: Request, res: Response) => {
    res.status(404).send("Not Found");
})

const port = 5000;
app.listen(port, () => {
    console.log(`server has started on port ${port}`);
})

module.exports = app;