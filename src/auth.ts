import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'dotenv/config';
import pool from './db';

export interface userData {
    userId: number
    username: string
    firstName: string
    lastName: string
    email: string
    creationDate: string,
    googleId: string
};

passport.use(new GoogleStrategy( {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,

    }, async (_, __, profile, done) => {
        const account = profile._json;
        const datetime = new Date();

        try {
            const currentUserQuery = await pool.query('SELECT * FROM app_user WHERE google_id = $1', [account.sub])
            if (currentUserQuery.rows.length === 0 ){
                const createUserQuery = "INSERT INTO app_user ( first_name, last_name, email, creation_date, google_id) VALUES ($1, $2, $3, $4, $5) RETURNING *";
                const createUserValues = [account.given_name, account.family_name, account.email, datetime, account.sub];
                const createUserResult = await pool.query(createUserQuery, createUserValues)
                const newUser = {
                    userId: createUserResult.rows[0].user_id,
                    username: null,
                    firstName: createUserResult.rows[0].first_name,
                    lastName: createUserResult.rows[0].last_name,
                    email: createUserResult.rows[0].email,
                    creationDate: createUserResult.rows[0].creation_date,
                    googleId: createUserResult.rows[0].google_id,
                }
                console.log('newuser:', newUser)
                done(null, newUser)
            } else {
                const user = {
                    userId: currentUserQuery.rows[0].user_id,
                    username: currentUserQuery.rows[0].username,
                    firstName: currentUserQuery.rows[0].first_name,
                    lastName: currentUserQuery.rows[0].last_name,
                    email: currentUserQuery.rows[0].email,
                    creationDate: currentUserQuery.rows[0].creation_date,
                    googleId: currentUserQuery.rows[0].google_id,
                }
                done(null, user)
            }
        } catch (err) {
            done(err)
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user)
    })

passport.deserializeUser((user, done) => {
    done(null, user)
})
