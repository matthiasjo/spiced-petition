DROP TABLE IF EXISTS users_profile;

CREATE TABLE user_profiles(
    id SERIAL PRIMARY  KEY,
    city VARCHAR,
    age INT,
    url VARCHAR,
    user_id INTEGER NOT NULL REFERENCES users(id) UNIQUE
)
