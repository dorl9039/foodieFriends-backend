import express, { Request, Response } from 'express';
import cors from 'cors';
import wishRoutes from './routes/wishRoutes';
import userRoutes from './routes/userRoutes';
import {findRestaurant} from './controllers/restaurantController';

const app = express();

const rest_name = 'Cloud & Spirits'
const address1 = '795 Main St'
const city = 'Cambridge'
const state = 'MA'
const country = 'US'
findRestaurant(rest_name, address1, city, state, country).then( data => console.log(data))

app.use(cors());
app.use(express.json());


// Set the routes
app.use('/wishes', wishRoutes);
app.use('/users', userRoutes);

app.use((req: Request, res: Response) => {
    res.status(404).send("Not Found");
})

const port = 5000;
app.listen(port, () => {
    console.log(`server has started on port ${port}`);
})

module.exports = app;