UPDATE schedule_items
   SET item_checked=$1
 WHERE item_id=$2;