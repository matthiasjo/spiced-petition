var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:postgres@localhost:5432/salt-petition");

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
        RETURNING id, name, surname`,
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

module.exports.getSignature = function getSignature(cookieId) {
    return db.query(`SELECT signature FROM signatures WHERE id=$1`, [cookieId]);
};

module.exports.getCount = function getCount() {
    return db.query(`SELECT COUNT(*) FROM signatures`);
};

module.exports.getList = function getList() {
    return db.query(`SELECT name, surname, city, age, url FROM users
    LEFT OUTER JOIN user_profiles
    ON users.id = user_profiles.user_id`);
};

module.exports.getCityList = function getCityList(city) {
    return db.query(
        `SELECT name, surname, city, age, url FROM users
    LEFT OUTER JOIN user_profiles
    ON users.id = user_profiles.user_id WHERE LOWER(city) = LOWER($1)`,
        [city]
    );
};

// module.exports.loginUser = function loginUser(email) {
//     return db.query(`SELECT email, password,  FROM users WHERE email=$1`, [
//         email
//     ]);
// };

module.exports.loginUser = function loginUser(email) {
    return db.query(
        `SELECT email, password, users.id AS user_id, signatures.id AS sign_id FROM users
    LEFT OUTER JOIN signatures
    ON users.id = signatures.user_id WHERE email=$1`,
        [email]
    );
};
