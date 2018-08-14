SELECT SUM(si.item_price) FROM schedule_items si
INNER JOIN schedules s
ON si.schedule_id = s.schedule_id
WHERE s.trip_id = $1;