import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'dotenv/config';
import pool from './db';
import { checkExists, createUser, matchPassword } from './routeHelpers' 


declare global {
    namespace Express {
        interface User {
            userId: number
            username: string
            firstName: string
            lastName: string
            email: string
            creationDate: string,
            googleId: string
            needsUsername: boolean
        }
    }
}

passport.use(new GoogleStrategy( {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,

    }, async (_, __, profile, done) => {
        const account = profile._json;
        const datetime = new Date();

        try {
            const currentUserResult = await pool.query('SELECT * FROM app_user WHERE google_id = $1', [account.sub])
            const currentUser = currentUserResult.rows
            if (currentUser.length === 0 ){
                const createUserQuery = "INSERT INTO app_user (first_name, last_name, email, creation_date, google_id) VALUES ($1, $2, $3, $4, $5) RETURNING *";
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
                    needsUsername: true
                }
                done(null, newUser)
            } 
            const user = {
                userId: currentUser[0].user_id,
                username: currentUser[0].username,
                firstName: currentUser[0].first_name,
                lastName: currentUser[0].last_name,
                email: currentUser[0].email,
                creationDate: currentUser[0].creation_date,
                googleId: currentUser[0].google_id,
                needsUsername: true
            }
            if (currentUser[0] && !currentUser[0].username){
                done(null, user);
            } else {
                done(null, {...user, needsUsername: false});
            }
        } catch (err) {
            done(err)
        }
    })
);



passport.use('local-register', new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    }, 
    async (req, username, password, done) => {
        try {
            const emailExists = await checkExists('email', req.body.email);
            const usernameExists = await checkExists('username', username);
            if (emailExists) {
                return done(null, false, {message: `The email '${req.body.email}' is already in use.`});
            } else if (usernameExists) {
                return done(null, false, {message: `The username '${username}' is already taken.`})
            }
            const user = await createUser(req.body.firstName, req.body.lastName, username, req.body.email, password)
            return done(null, user)
        } catch (error) {
            done(error)
        }
    }
    )
);
    
passport.use('local-login', new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    },
    async (req, username, password, done) => {
        try {
            const user = await checkExists('username', username);
            if (!user) {
                console.log("in auth.ts. Username does not exist")
                return done(null, false, {message:`The username '${username}' does not exist.`})
            };
            const isMatch = await matchPassword(password, user.password_hash);
            if (!isMatch) {
                return done(null, false, {message: 'Incorrect password provided.'})};
            
            return done(null, 
                {
                    userId: user.user_id,
                    username: user.username,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email,
                    creationDate: user.creation_date,
                    googleId: null,
                    needsUsername: false
                })
        } catch (error) {
            return done(error, false)
        }
    }
))
            
passport.serializeUser((user, done) => {
    console.log('in passport.serializeUser. user:', user)
    done(null, user)
    })

passport.deserializeUser((user: Express.User, done) => {
    console.log('in deserializeUser. user:', user)
    done(null, user)
})
