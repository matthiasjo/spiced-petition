
DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    signature TEXT NOT NULL
);
