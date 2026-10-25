-- Reserves the next trip id (the old New Trip flow asked for it before POST /api/trips).
SELECT nextval(pg_get_serial_sequence('trips', 'trip_id'))::int AS trip_id;
