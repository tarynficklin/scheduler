UPDATE packing_lists
   SET packing_checked=$1
 WHERE packing_id=$2;