-- The user's trips (and their schedules, items and packing lists) go with it: ON DELETE CASCADE.
DELETE FROM users
WHERE user_id = $1
RETURNING user_id;
