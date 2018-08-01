UPDATE trips
SET trip_location=$1,
  	trip_start_date=$2,
  	trip_end_date=$3,
  	trip_budget=$4,
  	trip_packing_list=$5,
  	trip_schedule=$6
WHERE trip_id=$7;

SELECT * FROM trips;