SELECT * FROM packing_lists
WHERE trip_id = $1
ORDER BY packing_id;