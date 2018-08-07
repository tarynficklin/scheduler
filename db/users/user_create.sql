INSERT INTO users (user_name, user_email, auth_id, auth_profile)
VALUES ( $1, $2, $3, $4 )
RETURNING *;