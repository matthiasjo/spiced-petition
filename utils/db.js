var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:postgres@localhost:5432/salt-petition");

module.exports.addSignature = function addSignature(
    nameForm,
    surnameForm,
    signatureForm
) {
    if (
        !/[^a-z]/i.test(nameForm) &&
        !/[^a-z]/i.test(surnameForm) &&
        signatureForm != ""
    ) {
        return db.query(
            `INSERT INTO signatures (name, surname, signature) VALUES ($1 , $2, $3)
        RETURNING id`,
            [nameForm, surnameForm, signatureForm]
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

module.exports.getNames = function getNames() {
    return db.query(`SELECT name, surname FROM signatures`);
};

module.exports.addUser = function addUser(
    nameReg,
    surnameReg,
    emailReg,
    pwHash
) {
    // if (
    //     !/[^a-z]/i.test(nameReg) &&
    //     !/[^a-z]/i.test(surnameReg) &&
    //     pwHash != ""
    // ) {
    return db.query(
        `INSERT INTO users (name, surname, email, password) VALUES ($1 , $2, $3, $4)
        RETURNING id`,
        [nameReg, surnameReg, emailReg, pwHash]
    );
    // } else {
    //     return Promise.reject(new Error("Wrong input"));
    // }
};

module.exports.loginUser = function loginUser(email) {
    return db.query(`SELECT email, password FROM users WHERE email=$1`, [
        email
    ]);
};
