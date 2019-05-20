const express = require("express");
const router = express.Router();
const db = require("../utils/db");
//const { requireNoSignature } = require("../middleware");

module.exports = router;

router.route("/petition/signers").get((req, res) => {
    Promise.all([db.getCount(), db.getList()])
        .then(qResponse => {
            res.render("signers", {
                layout: "main",
                numSigners: qResponse[0].rows[0].count,
                Data: qResponse[1].rows,
                activeUser: req.session.userID
            });
        })
        .catch(err => console.log(err));
});

router.route("/petition/signers/:city").get((req, res) => {
    db.getCityList(req.params.city)
        .then(qResponse => {
            res.render("signers", {
                layout: "main",
                siteName: "List of worker Bees",
                Data: qResponse.rows,
                activeUser: req.session.userID
            });
        })
        .catch(err => console.log(err));
});
