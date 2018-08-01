DROP TABLE users;

CREATE TABLE users (
	user_id      SERIAL PRIMARY KEY,
	user_name    VARCHAR(100),
	user_email   VARCHAR(100),
	auth_id      TEXT,
	auth_profile TEXT
);

SELECT * FROM users;