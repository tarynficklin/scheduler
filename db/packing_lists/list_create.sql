INSERT INTO packing_lists (trip_id, packing_title)
SELECT trip_id, $2::varchar FROM trips
WHERE trip_id = $1 AND user_id = $3
RETURNING *;
