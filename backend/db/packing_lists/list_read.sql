SELECT p.* FROM packing_lists p
JOIN trips t ON t.trip_id = p.trip_id
WHERE p.trip_id = $1 AND t.user_id = $2
ORDER BY p.packing_id;
