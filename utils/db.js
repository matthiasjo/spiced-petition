const spicedPg = require("spiced-pg");

const dbUrl =
    process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/salt-petition";
const db = spicedPg(dbUrl);

module.exports.addUser = function addUser(
    nameReg,
    surnameReg,
    emailReg,
    pwHash
) {
    if (
        !/[^a-z]/i.test(nameReg) &&
        !/[^a-z]/i.test(surnameReg) &&
        pwHash != ""
    ) {
        return db.query(
            `INSERT INTO users (name, surname, email, password) VALUES ($1 , $2, $3, $4)
        RETURNING id, name, surname, email`,
            [nameReg, surnameReg, emailReg, pwHash]
        );
    } else {
        return Promise.reject(new Error("Wrong input"));
    }
};

module.exports.createProfile = function createProfile(
    city,
    age,
    homepage,
    userId
) {
    return db.query(
        `INSERT INTO user_profiles (city, age, url, user_id) VALUES($1, $2, $3, $4)`,
        [city, age, homepage, userId]
    );
};

module.exports.addSignature = function addSignature(signatureForm, userId) {
    if (signatureForm != "") {
        return db.query(
            `INSERT INTO signatures (signature, user_id) VALUES ($1, $2)
        RETURNING id`,
            [signatureForm, userId]
        );
    } else {
        return Promise.reject(new Error("Wrong input"));
    }
};

module.exports.getSignature = function getSignature(signId) {
    return db.query(`SELECT signature FROM signatures WHERE id=$1`, [signId]);
};

module.exports.getCount = function getCount() {
    return db.query(`SELECT COUNT(*) FROM signatures`);
};

module.exports.getList = function getList() {
    return db.query(`SELECT name, surname, city, age, url
    FROM signatures
    LEFT OUTER JOIN user_profiles ON signatures.user_id = user_profiles.user_id
    LEFT OUTER JOIN users ON signatures.user_id = users.id`);
};

module.exports.getCityList = function getCityList(city) {
    return db.query(
        `SELECT name, surname, city, age, url
        FROM signatures
        LEFT OUTER JOIN user_profiles ON signatures.user_id = user_profiles.user_id
        LEFT OUTER JOIN users ON signatures.user_id = users.id
        WHERE LOWER(city) = LOWER($1)`,
        [city]
    );
};

//login & edit profile
module.exports.selectUser = function selectUser(email) {
    return db.query(
        `SELECT email, password, city, age, url, name, surname, signatures.signature, users.id AS user_id, signatures.id AS sign_id
        FROM users
        LEFT OUTER JOIN signatures ON users.id = signatures.user_id
        LEFT OUTER JOIN user_profiles ON users.id = user_profiles.user_id
        WHERE email=$1`,
        [email]
    );
};

module.exports.updateUser = function updateUser(
    name,
    surname,
    email,
    hashPw,
    id
) {
    if (hashPw) {
        return db.query(
            `UPDATE users SET name = $1, surname = $2, email = $3, password = $4 WHERE id = $5;`,
            [name, surname, email, hashPw, id]
        );
    } else if (!hashPw) {
        return db.query(
            `UPDATE users SET name = $1, surname = $2, email = $3 WHERE id = $4;`,
            [name, surname, email, id]
        );
    }
};

module.exports.upsertUserProfile = function upsertUserProfile(
    city,
    age,
    url,
    user_id
) {
    return db.query(
        `INSERT INTO user_profiles (city, age, url, user_id) VALUES($1, $2, $3, $4) ON CONFLICT (user_id) DO UPDATE SET city=$1, age=$2, url=$3`,
        [city, age, url, user_id]
    );
};

module.exports.deleteSignature = function deleteSignature(sign_id) {
    return db.query(`DELETE FROM signatures WHERE user_id=$1`, [sign_id]);
};

module.exports.deleteAccount = function deleteAccount(user_id) {
    return db.query(`DELETE FROM users WHERE id=$1`, [user_id]);
};
