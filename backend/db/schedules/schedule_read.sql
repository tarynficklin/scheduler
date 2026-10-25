SELECT s.* FROM schedules s
JOIN trips t ON t.trip_id = s.trip_id
WHERE s.trip_id = $1 AND t.user_id = $2
ORDER BY s.schedule_id;
