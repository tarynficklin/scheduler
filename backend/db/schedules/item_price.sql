UPDATE schedule_items si
   SET item_price=$1
  FROM schedules s
  JOIN trips t ON t.trip_id = s.trip_id
 WHERE si.item_id=$2 AND s.schedule_id = si.schedule_id AND t.user_id = $3
RETURNING si.*;
