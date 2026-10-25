UPDATE trips
   SET trip_location=$1
 WHERE trip_id=$2 AND user_id=$3
RETURNING *;
