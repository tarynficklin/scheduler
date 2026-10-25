-- Total price of every schedule item on the trip, rounded to cents (0 when there are none).
SELECT COALESCE(ROUND(SUM(si.item_price)::numeric, 2), 0)::float8 AS sum
FROM schedule_items si
INNER JOIN schedules s ON si.schedule_id = s.schedule_id
INNER JOIN trips t ON t.trip_id = s.trip_id
WHERE s.trip_id = $1 AND t.user_id = $2;
