SELECT si.* FROM schedule_items si
JOIN schedules s ON s.schedule_id = si.schedule_id
JOIN trips t ON t.trip_id = s.trip_id
WHERE si.schedule_id = $1 AND t.user_id = $2
ORDER BY si.item_id;
