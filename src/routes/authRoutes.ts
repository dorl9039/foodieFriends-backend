import express, { Request, Response, Router } from 'express';
import passport from 'passport';


const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('hi auth');
});

router.get(
    '/google', passport.authenticate(
        "google", {scope: ["profile"]})
);

router.get(
    '/google/callback', passport.authenticate(
        'google', {session: [true]}))

export default router;