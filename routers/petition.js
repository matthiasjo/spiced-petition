const express = require("express");
const router = express.Router();
const db = require("../utils/db");
const { requireNoSignature } = require("../middleware");
//const { logger } = require("../index");

module.exports = router;

router
    .route("/petition")
    .get(requireNoSignature, (req, res) => {
        res.render("petition", {
            layout: "main",
            first: req.session.firstName,
            last: req.session.lastName,
            activeUser: req.session.userID
        });
    })
    .post((req, res) => {
        if (req.session.userID) {
            db.addSignature(req.body.signature, req.session.userID)
                .then(qResponse => {
                    req.session.signID = qResponse.rows[0].id;
                    res.redirect("/petition/signed");
                })
                .catch(err => {
                    console.log(err);
                    res.render("petition", {
                        layout: "main",
                        error: "Wrong input. Try again"
                    });
                });
        } else if (!req.session.userID && !req.session.signID) {
            res.render("petition", {
                layout: "main",
                error: "Please register or log in before signing the petition"
            });
        }
    });
