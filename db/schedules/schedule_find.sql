SELECT s.* FROM schedules s
JOIN trips t ON t.trip_id = s.trip_id
WHERE s.schedule_id = $1 AND t.user_id = $2;
