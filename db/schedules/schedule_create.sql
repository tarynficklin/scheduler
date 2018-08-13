INSERT INTO schedules (trip_id, schedule_date)
VALUES ( $1, $2 )
RETURNING *;