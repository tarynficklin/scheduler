-- $1 is an optional trip id reserved with trip_read_last; NULL takes the next one.
INSERT INTO trips (
	trip_id,
	user_id,
	trip_location,
	trip_start_date,
	trip_end_date,
	trip_budget,
	trip_background,
	trip_bg_color
	)
VALUES (
	COALESCE($1::int, nextval(pg_get_serial_sequence('trips', 'trip_id'))::int),
	$2, $3, $4, $5, $6, $7, $8
)
RETURNING *;
