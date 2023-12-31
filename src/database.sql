CREATE DATABASE foodiefriends_development;

CREATE TABLE app_user(
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE, 
    password_hash TEXT,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    creation_date DATE DEFAULT CURRENT_DATE,
    google_id TEXT UNIQUE
);


CREATE TABLE restaurant(
    restaurant_id TEXT PRIMARY KEY,
    restaurant_name TEXT,
    address_line1 TEXT,
    address_city TEXT,
    address_state TEXT,
    address_country TEXT,
    longitude DOUBLE PRECISION,
    latitude DOUBLE PRECISION,
    cuisine TEXT,
    price_range VARCHAR(8),
    photo TEXT
);

create TABLE wish(
    wish_id SERIAL PRIMARY KEY,
    user_id INT,
    restaurant_id TEXT,
    restaurant_name TEXT,
    wish_comment TEXT,
    wish_priority INT
);

CREATE TABLE attendee(
    user_id INT,
    visit_id INT,
    visit_comment TEXT,
    rating NUMERIC CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5)
);


CREATE TABLE visit (
    visit_id SERIAL PRIMARY KEY,
    restaurant_id TEXT,
    restaurant_name TEXT,
    visit_date TIMESTAMP
);


CREATE TABLE friend(
    friend1_id INT,
    friend2_id INT,
    CONSTRAINT unique_friendship UNIQUE (friend1_id, friend2_id)
);

