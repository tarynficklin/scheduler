SELECT * FROM schedules
WHERE trip_id = $1
ORDER BY schedule_id;