-- Missing (NULL) values keep the current ones.
UPDATE users
   SET user_name  = COALESCE($1, user_name),
       user_email = COALESCE($2, user_email)
 WHERE user_id = $3
RETURNING user_id, user_name, user_email;
