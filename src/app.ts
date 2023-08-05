import express, { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
import 'dotenv/config';
import './auth'
import wishRoutes from './routes/wishRoutes';
import userRoutes from './routes/userRoutes';
import restaurantRoutes from './routes/restaurantRoutes';
import visitRoutes from './routes/visitRoutes';
import indexRoutes from './routes/indexRoutes';

const app = express();

app.use(cors({    
    credentials: true,
    origin: process.env.CLIENT_URL,
    }
));

app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        cookie: {
            secure: process.env.NODE_ENV === 'production' ? true : 'auto',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        },
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());


// Set the routes
app.use('/', indexRoutes)
app.use('/wishes', wishRoutes);
app.use('/users', userRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/visits', visitRoutes);
app.use('/auth', authRoutes);

app.use((req: Request, res: Response) => {
    res.status(404).send("Not Found");
})

const port = 5000;
app.listen(port, () => {
    console.log(`server has started on port ${port}`);
})

module.exports = app;