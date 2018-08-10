INSERT INTO schedule_items (schedule_id, item_title, item_price, item_time)
VALUES ( $1, $2, $3, $4 )
RETURNING *;