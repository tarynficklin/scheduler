SELECT * FROM trips
WHERE user_id=$1
ORDER BY trip_id;