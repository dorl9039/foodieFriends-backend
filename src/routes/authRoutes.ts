import express, { Request, Response, Router } from 'express';
import passport from 'passport';
import session from 'express-session';


const router = Router();


router.get(
    '/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get(
    '/google/callback', 
    passport.authenticate('google', {session: true}), (req: Request, res: Response) => {
        if (req.user.needsUsername) {
            res.redirect(`${process.env.CLIENT_URL}/register`)
        } else {
        res.redirect(`${process.env.CLIENT_URL}`);
        }
    }
);

router.post(
    '/login', 
    passport.authenticate('local-login', { session: true }),
    (req, res, next) => {
        res.send(req.user)
    }
)

router.post('/logout', (req: Request, res: Response, next) => {
    res.clearCookie('connect.sid')
    req.logout(() => {
        req.session.destroy(err => {
            if (err) {
                console.log("Error destroying session:", err);
                return res.status(500).send("Failed to destroy session");
            }
            res.send("Logged out successfully");
            })
        })
    });
router.post(
    '/register', 
    passport.authenticate('local-register', { session: true, successRedirect: `${process.env.CLIENT_URL}`, failureRedirect: '/register' })
)

// router.post(
//     '/login', 
//     passport.authenticate('local-login', { session: true, successRedirect: `${process.env.CLIENT_URL}`, failureRedirect: '/login' })
//     )

// router.post(
//     '/login', 
//     passport.authenticate('local-login', { session: true}), (req, res) => {
//         if (!req.user) {
//             res.redirect(`${process.env.CLIENT_URL}/login`)
//         }
//         res.send(req.user)
//         res.redirect(`${process.env.CLIENT_URL}`)
//     }
//     )


// router.post(
//     '/register',
//     passport.authenticate('local-register', { session: true }),
//     (req, res, next) => {
//         res.send(req.user)
//     }
// )


export default router;