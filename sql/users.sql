
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL CHECK (name <> ''),
    surname VARCHAR(255) NOT NULL CHECK (surname <> ''),
    email TEXT NOT NULL UNIQUE CHECK (email <> ''),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
