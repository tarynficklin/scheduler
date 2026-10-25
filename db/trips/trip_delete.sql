-- Schedules, schedule items and packing lists are removed by ON DELETE CASCADE.
DELETE FROM trips
WHERE trip_id = $1 AND user_id = $2
RETURNING *;
