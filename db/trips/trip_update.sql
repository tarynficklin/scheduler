UPDATE trips
	 SET trip_location=$1,
			 trip_start_date=$2,
			 trip_end_date=$3,
			 trip_budget=$4
 WHERE trip_id=$5;