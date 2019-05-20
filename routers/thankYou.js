const express = require("express");
const router = express.Router();
const db = require(".././utils/db");

module.exports = router;

router.route("/petition/signed").get((req, res) => {
    Promise.all([db.getCount(), db.getSignature(req.session.signID)])
        .then(results => {
            res.render("signed", {
                layout: "main",
                signatureUrl: results[1].rows[0].signature,
                numSigner: results[0].rows[0].count,
                activeUser: req.session.userID
            });
        })
        .catch(err => {
            console.log(err);
        });
});
