CREATE DATABASE foodiefriends_development;

CREATE TABLE app_user(
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE, 
    password_hash TEXT,
    first_name TEXT,
    last_name TEXT,
    email_address TEXT,
    creation_date DATE DEFAULT CURRENT_DATE
);

INSERT INTO app_user (username, first_name) VALUES ('user2', 'muji');

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
    price_range VARCHAR(8)
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
    visit_comment TEXT
);

INSERT INTO attendee (user_id, visit_id, visit_comment) VALUES (1, 1, 'test gethistory')
INSERT INTO attendee (user_id, visit_id, visit_comment) VALUES (1, 2, 'cloud & spirits visit')
INSERT INTO attendee (user_id, visit_id, visit_comment) VALUES (2, 1, 'user2 visit to Noreetuh')


CREATE TABLE visit (
    visit_id SERIAL PRIMARY KEY,
    restaurant_id TEXT,
    restaurant_name TEXT,
    visit_date TIMESTAMP
);

INSERT INTO visit (restaurant_id, restaurant_name, visit_date) VALUES ('rCpO-kMHljieU0geK0RJQw', 'Noreetuh', '2023-08-01');
INSERT INTO visit (restaurant_id, restaurant_name, visit_date) VALUES ('rCpO-y4Kebbseem1lPjzG2BKwgg', 'Cloud & Spirits', '2023-07-31');

SELECT v.visit_id, v.restaurant_id, v.restaurant_name, v.visit_date, a.user_id, a.visit_comment FROM attendee as a JOIN visit as v ON v.visit_id = a.visit_id WHERE a.user_id = 1;

SELECT u.username FROM attendee as a JOIN app_user as u ON a.user_id = u.user_id JOIN visit as v ON v.visit_id = a.visit_id WHERE v.visit_id = 1;

CREATE TABLE friend(
    friend1_id INT,
    friend2_id INT
);

