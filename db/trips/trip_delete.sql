DELETE
FROM schedule_items
WHERE schedule_id IN (
    SELECT schedule_id
    FROM schedules
    WHERE trip_id = $1
);

DELETE
FROM schedules
WHERE trip_id = $1;

DELETE
FROM packing_lists
WHERE trip_id = $1;

DELETE
FROM trips
WHERE trip_id = $1;