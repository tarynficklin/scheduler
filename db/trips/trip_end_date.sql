UPDATE trips
   SET trip_end_date=$1
 WHERE trip_id=$2 AND user_id=$3
RETURNING *;
