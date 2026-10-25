DELETE FROM packing_lists p
USING trips t
WHERE p.packing_id = $1 AND t.trip_id = p.trip_id AND t.user_id = $2
RETURNING p.*;
