import express, { Router, Request, Response } from 'express';
import { isAuth } from '../routeHelpers';

const router = Router();

router.get('/account' , isAuth, (req:Request, res: Response) => {
    const user = {
        ...req.user,
        loggedIn: true
    }
    res.status(200).json(user);
});

export default router