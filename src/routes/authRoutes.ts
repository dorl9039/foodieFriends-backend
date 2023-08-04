import express, { Request, Response, Router } from 'express';
import passport from 'passport';
import session from 'express-session';


// declare module 'express-session' {
//     export interface SessionData
// }
const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('hi auth');
});

router.get(
    '/google', passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

router.get(
    '/google/callback', 
    passport.authenticate('google', {session: true}), (req: Request, res: Response) => {
        res.send(req.user)
    }
);

export default router;