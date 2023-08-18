# FoodieFriends - Backend

FoodieFriends is a social media and lifestyle web application for tracking restaurants and connecting with friends over food. 

A user can add and organize the restaurants they want to try out, mark a restaurant as visited with friends, and add rankings and comments to each wish or visit record. A friend who has the same restaurant on their wishlist will show up as a suggested FoodieFriend, so it's easy for users to find company for trying out new restaurants!

This app was created using a PERN (with Typescript) techstack with REST API routes.

## Dependencies
This project uses Typescript, as well as the following Node.js libraries:
* [pg](https://www.npmjs.com/package/pg) (for connecting to the Postgres database)
* [dotenv](https://www.npmjs.com/package/dotenv) (for loading environment variables)
* [Express.js](https://expressjs.com/) (for implementing a REST API)
  * express-session(for managing user sessions) 
* [Passport.js](https://www.passportjs.org/) (user authentication)
  * passport-local (for authorizing users registered in the database)
  * passport-google-oauth20 (for authorizing users via their Google accounts)
* [bcrypt](https://www.npmjs.com/package/bcrypt) (for password security)

## Other resources
* [Yelp Fusion API](https://docs.developer.yelp.com/docs/fusion-intro)
  * Business Match
  * Business Details


## Installation
1. Git clone this repository
2. Install dependencies by running `npm install`
3. Start up Postgres, e.g., by running `psql -U postgres`
    * Follow the list of commands in `database.sql` within this repo to create a database with the appropriate tables
4. Set up a .env file with the following:
    * `YELP_API_TOKEN` (Your Yelp API token)
    * `CLIENT_URL` (URL for frontend)
    * `CLIENT_ID` (Client ID from Google OAuth2.0)
    * `CLIENT_SECRET` (Client Secret from Google OAuth2.0)
    * `COOKIE_SECRET` (Randomly generated, very long string of characters)
    * `GOOGLE_CALLBACK_URL` ([your backend URL]/auth/google/callback)
5. Compile the .ts files by running `npm run tsc`
6. Start the server by running `node dist/app.js`



