DROP TABLE IF EXISTS users_profile;

CREATE TABLE user_profiles(
    id SERIAL PRIMARY  KEY,
    city VARCHAR,
    age INT,
    url VARCHAR,
    user_id INTEGER NOT NULL UNIQUE
);

ALTER TABLE user_profiles
    ADD FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE;
