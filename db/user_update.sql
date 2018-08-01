UPDATE users
SET user_name=$1,
    user_email=$2
WHERE user_id=$3;

SELECT * FROM users;