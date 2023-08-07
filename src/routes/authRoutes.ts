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

// router.post(
//     '/login', 
//     passport.authenticate('local-login', { session: true }),
//     (req, res, next) => {
//         res.send(req.user)
//     }
// )

router.post('/login', function (req, res, next) {
    passport.authenticate('local-login', {session: true}, function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        // *** Display message without using flash option
        res.status(401).send(info.message);
      } else {
        req.logIn(user, (err) => {
            if (err) {
                return next(err)
            }
            res.status(200).send(user)
        })
      }
    })(req, res, next);
  });
  

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

    
// router.post(
//     '/register',
//     passport.authenticate('local-register', { session: true }),
//     (req, res, next) => {
//         res.send(req.user)
//     }
// )

router.post('/register', function (req, res, next) {
    passport.authenticate('local-register', {session: true}, function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        // *** Display message without using flash option
        res.status(401).send(info.message);
      } else {
        req.logIn(user, (err) => {
            if (err) {
                return next(err)
            }
            res.status(200).send(user)
        })
      }
    })(req, res, next);
  });

export default router;