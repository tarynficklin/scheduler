DELETE FROM schedule_items si
USING schedules s
JOIN trips t ON t.trip_id = s.trip_id
WHERE si.item_id = $1 AND s.schedule_id = si.schedule_id AND t.user_id = $2
RETURNING si.*;
