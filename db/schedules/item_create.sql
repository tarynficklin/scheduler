INSERT INTO schedule_items (schedule_id, item_title, item_price, item_time)
SELECT s.schedule_id, $2::varchar, $3::float8, $4::varchar
FROM schedules s
JOIN trips t ON t.trip_id = s.trip_id
WHERE s.schedule_id = $1 AND t.user_id = $5
RETURNING *;
