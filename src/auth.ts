import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'dotenv/config';
import pool from './db';

passport.use(new GoogleStrategy( {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,

    }, async (_, __, email, profile, done) => {
        const account = profile._json;
        console.log('account', account);
        console.log('email', account.email)
        try {
            const currentUserQuery = await pool.query('SELECT * FROM app_user WHERE google_id = $1', [account.sub])
            // if (currentUserQuery.rows.length === 0 ){
                
            // }
        } catch (err) {
            done(err)
        }
    })
)