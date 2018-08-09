SELECT * FROM schedule_items
WHERE schedule_id = $1
ORDER BY item_id;