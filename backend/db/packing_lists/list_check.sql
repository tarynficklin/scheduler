UPDATE packing_lists p
   SET packing_checked=$1
  FROM trips t
 WHERE p.packing_id=$2 AND t.trip_id = p.trip_id AND t.user_id = $3
RETURNING p.*;
