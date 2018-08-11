INSERT INTO schedules (trip_id, schedule_day, schedule_month, schedule_year)
VALUES ( $1, $2, $3, $4 )
RETURNING *;