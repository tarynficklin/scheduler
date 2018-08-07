DROP TABLE trips;

CREATE TABLE trips (
	trip_id             SERIAL PRIMARY KEY,
	trip_location       TEXT,
	trip_start_date     VARCHAR(10),
	trip_end_date       VARCHAR(10),
	trip_budget         INTEGER,
	user_id             INTEGER REFERENCES users(user_id)
);

SELECT * FROM trips;