SELECT * FROM trips;
INSERT INTO trips (
	trip_id,
	user_id,
	trip_location,
	trip_start_date,
	trip_end_date,
	trip_budget,
	trip_background
	)
VALUES ( $1, $2, $3, $4, $5, $6, $7 );