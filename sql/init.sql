
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL CHECK (name <> ''),
    surname VARCHAR(255) NOT NULL CHECK (surname <> ''),
    email TEXT NOT NULL UNIQUE CHECK (email <> ''),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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


    DROP TABLE IF EXISTS signatures;

    CREATE TABLE signatures(
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        signature TEXT NOT NULL CHECK (signature <> '')
    );

    ALTER TABLE signatures
        ADD FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE;
