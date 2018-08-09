UPDATE trips
   SET trip_end_date=$1,
 WHERE trip_id=$2;