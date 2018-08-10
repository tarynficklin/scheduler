INSERT INTO packing_lists (trip_id, packing_title)
VALUES ( $1, $2 )
RETURNING *;