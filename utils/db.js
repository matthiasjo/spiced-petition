var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:postgres@localhost:5432/salt-petition");

module.exports.addSignature = function addSignature(
    nameForm,
    surnameForm,
    signatureForm
) {
    if (nameForm == "" || surnameForm == "" || signatureForm == "") {
        Promise.reject(new Error("Wrong input"));
    } else {
        return db.query(
            `INSERT INTO signatures (name, surname, signature) VALUES ($1 , $2, $3)
        RETURNING id`,
            [nameForm, surnameForm, signatureForm]
        );
    }
};

module.exports.getSignature = function getSignature(cookieId) {
    return db.query(`SELECT signature FROM signatures WHERE id=$1`, [cookieId]);
};

module.exports.getNames = function getNames() {
    return db.query(`SELECT name, surname FROM signatures`);
};
