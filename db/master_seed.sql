--nuke the tabels
DROP TABLE schedule_items;
DROP TABLE schedules;
DROP TABLE packing_lists;
DROP TABLE trips;
DROP TABLE users;

--base table
CREATE TABLE users (
	user_id      SERIAL PRIMARY KEY,
	user_name    VARCHAR(100),
	user_email   VARCHAR(100),
	auth_id      TEXT,
	auth_profile TEXT
);

INSERT INTO users (user_id, user_name, user_email, auth_id, auth_profile)
VALUES (1, 'Taryn Ficklin', 'tarynficklin@gmail.com', 'google-oauth2|100800992512531079080', 'https://lh4.googleusercontent.com/-xeeCTQ3xyYw/AAAAAAAAAAI/AAAAAAAAAHM/59818DJojEk/photo.jpg');

INSERT INTO users (user_id, user_name, user_email, auth_id, auth_profile)
VALUES (2, 'Taryn Ficklin', 'clayf700@gmail.com', 'google-oauth2|115352869833705350314', 'https://lh4.googleusercontent.com/-WtSvKjFYiXM/AAAAAAAAAAI/AAAAAAAAAHc/fXzUoy8H42A/photo.jpg');

INSERT INTO users (user_id, user_name, user_email, auth_id, auth_profile)
VALUES (3, 'TarynFicklin@gmail.com', 'TarynFicklin@gmail.com', 'github|38847691', 'https://avatars2.githubusercontent.com/u/38847691?v=4');

INSERT INTO users (user_id, user_name, user_email, auth_id, auth_profile)
VALUES (4, 'Taryn Ficklin', 'clayf700@gmail.com', 'facebook|1346171328848139', 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1346171328848139&height=50&width=50&ext=1536190305&hash=AeTPNLQ9xlGCTpxU');

SELECT * FROM users;



--trips are a child of users
CREATE TABLE trips (
	trip_id             SERIAL PRIMARY KEY,
	user_id             INTEGER REFERENCES users(user_id),
	trip_location       TEXT DEFAULT '',
	trip_start_date     VARCHAR(10) DEFAULT '',
	trip_end_date       VARCHAR(10) DEFAULT '',
	trip_budget         FLOAT DEFAULT 0
);

INSERT INTO trips (user_id, trip_location, trip_start_date, trip_end_date, trip_budget)
VALUES (1, 'New York', '7/26/2018', '7/28/2018', 499.99);

INSERT INTO trips (user_id, trip_location, trip_start_date, trip_end_date, trip_budget)
VALUES (1, 'San Francisco', '9/20/2019', '9/22/2019', 699.99);

INSERT INTO trips (user_id, trip_location, trip_start_date, trip_end_date, trip_budget)
VALUES (2, 'Chicago', '8/23/2018', '8/25/2018', 799.99);

INSERT INTO trips (user_id, trip_location, trip_start_date, trip_end_date, trip_budget)
VALUES (2, 'Hawaii', '12/31/2018', '1/2/2019', 1999.99);

SELECT * FROM trips;



--packing lists are a child of trips
CREATE TABLE packing_lists (
	packing_id       SERIAL PRIMARY KEY,
	trip_id          INTEGER REFERENCES trips(trip_id),
	packing_title    VARCHAR(100) DEFAULT '',
	packing_checked  BOOLEAN DEFAULT false
);

INSERT INTO packing_lists (trip_id, packing_title)
VALUES (1, 'Socks');

INSERT INTO packing_lists (trip_id, packing_title)
VALUES (1, 'Shoes');

INSERT INTO packing_lists (trip_id, packing_title)
VALUES (2, 'Hat');

INSERT INTO packing_lists (trip_id, packing_title)
VALUES (2, 'Pants');

INSERT INTO packing_lists (trip_id, packing_title)
VALUES (3, 'Snacks');

INSERT INTO packing_lists (trip_id, packing_title)
VALUES (3, 'Sun Lotion');

INSERT INTO packing_lists (trip_id, packing_title)
VALUES (4, 'Sandals');

INSERT INTO packing_lists (trip_id, packing_title)
VALUES (4, 'Sun Glasses');

SELECT * FROM packing_lists;



--schedules are a child of trips
CREATE TABLE schedules (
	schedule_id     SERIAL PRIMARY KEY,
	trip_id	        INTEGER REFERENCES trips(trip_id),
	schedule_date   VARCHAR(50) DEFAULT ''
);

INSERT INTO schedules (trip_id, schedule_date)
VALUES (1, 'July 26th 2018');

INSERT INTO schedules (trip_id, schedule_date)
VALUES (1, 'July 27th 2018');

INSERT INTO schedules (trip_id, schedule_date)
VALUES (1, 'July 28th 2018');

INSERT INTO schedules (trip_id, schedule_date)
VALUES (2, 'September 20th 2019');

INSERT INTO schedules (trip_id, schedule_date)
VALUES (2, 'September 21st 2019');

INSERT INTO schedules (trip_id, schedule_date)
VALUES (2, 'September 22nd 2019');

INSERT INTO schedules (trip_id, schedule_date)
VALUES (3, 'August 23rd 2018');

INSERT INTO schedules (trip_id, schedule_date)
VALUES (3, 'August 24th 2018');

INSERT INTO schedules (trip_id, schedule_date)
VALUES (3, 'August 25th 2018');

INSERT INTO schedules (trip_id, schedule_date)
VALUES (4, 'December 31st 2018');

INSERT INTO schedules (trip_id, schedule_date)
VALUES (4, 'Janurary 1st 2019');

INSERT INTO schedules (trip_id, schedule_date)
VALUES (4, 'January 2nd 2019');

SELECT * FROM schedules;



--schedule items are a child of schedules
CREATE TABLE schedule_items (
	item_id       SERIAL PRIMARY KEY,
	schedule_id   INTEGER REFERENCES schedules(schedule_id),
	item_title    VARCHAR(100) DEFAULT '',
	item_price    FLOAT DEFAULT 0,
	item_time     VARCHAR(10) DEFAULT 'morning',
	item_checked  BOOLEAN DEFAULT false
);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (1, 'Eat New York Breakfast', 'morning', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (1, 'Eat New York Breakfast', 'day', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (1, 'Eat New York Breakfast', 'night', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (2, 'Eat New York Lunch', 'morning', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (2, 'Eat New York Lunch', 'day', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (2, 'Eat New York Lunch', 'night', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (3, 'Eat New York Dinner', 'morning', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (3, 'Eat New York Dinner', 'day', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (3, 'Eat New York Dinner', 'night', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (4, 'Eat San Francisco Breakfast', 'morning', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (4, 'Eat San Francisco Breakfast', 'day', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (4, 'Eat San Francisco Breakfast', 'night', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (5, 'Eat San Francisco Lunch', 'morning', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (5, 'Eat San Francisco Lunch', 'day', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (5, 'Eat San Francisco Lunch', 'night', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (6, 'Eat San Francisco Dinner', 'morning', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (6, 'Eat San Francisco Dinner', 'day', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (6, 'Eat San Francisco Dinner', 'night', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (7, 'Eat Chicago Breakfast', 'morning', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (7, 'Eat Chicago Breakfast', 'day', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (7, 'Eat Chicago Breakfast', 'night', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (8, 'Eat Chicago Lunch', 'morning', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (8, 'Eat Chicago Lunch', 'day', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (8, 'Eat Chicago Lunch', 'night', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (9, 'Eat Chicago Dinner', 'morning', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (9, 'Eat Chicago Dinner', 'day', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (9, 'Eat Chicago Dinner', 'night', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (10, 'Eat Hawaii Breakfast', 'morning', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (10, 'Eat Hawaii Breakfast', 'day', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (10, 'Eat Hawaii Breakfast', 'night', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (11, 'Eat Hawaii Lunch', 'morning', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (11, 'Eat Hawaii Lunch', 'day', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (11, 'Eat Hawaii Lunch', 'night', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (12, 'Eat Hawaii Dinner', 'morning', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (12, 'Eat Hawaii Dinner', 'day', 12.99);

INSERT INTO schedule_items (schedule_id, item_title, item_time, item_price)
VALUES (12, 'Eat Hawaii Dinner', 'night', 12.99);

SELECT * FROM schedule_items;



--clear the tabels
	-- DELETE FROM schedule_items;
	-- DELETE FROM schedules;
	-- DELETE FROM packing_lists;
	-- DELETE FROM trips;
	-- DELETE FROM users;

--see all tabels
	-- SELECT * FROM users;
	-- SELECT * FROM trips;
	-- SELECT * FROM packing_lists;
	-- SELECT * FROM schedules;
	-- SELECT * FROM schedule_items;