SELECT * FROM trips;
INSERT INTO trips (
	trip_location,
	trip_start_date,
	trip_end_date,
	trip_budget,
	trip_packing_list,
	trip_schedule
	)
VALUES ( $1, $2, $3, $4, $5, $6 );

-- {
-- 	"trip_location":"New York",
-- 	"trip_start_date":"07/12",
-- 	"trip_end_date":"08/13",
-- 	"trip_budget":"12",
-- 	"trip_packing_list":{"packingList":[
-- 		{"title": "Shirts", "isChecked": true},
-- 		{"title": "Shirts", "isChecked": true}
-- 	]},
-- 	"trip_schedule":{"tripSchedule":[
-- 		{"monday": [
-- 			{"title":"Drive to New York", "price":2.59, "isChecked":true},
-- 			{"title":"Breakfast", "price":3.99, "isChecked":false},
-- 			{"title":"Statue", "price":null, "isChecked":true}
-- 			]}
-- 		]}
-- }