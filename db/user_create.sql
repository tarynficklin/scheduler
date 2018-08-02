INSERT INTO users (user_name, user_email, auth_id, auth_profile)
VALUES ( $1, $2, $3, $4 )
RETURNING *;

-- {
-- 	"user_name":"grubsy",
-- 	"user_email":"grubsy@gmail.com",
-- 	"auth_id": 'auth0 id',
-- 	"auth_profile": 'auth 0 profile picture'
-- }