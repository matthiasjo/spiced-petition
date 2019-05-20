const express = require("express");
const router = express.Router();
const db = require("../utils/db");
const { requireNoSignature } = require("../middleware");

module.exports = router;

router
    .route("/profile")
    .get(requireNoSignature, (req, res) => {
        res.render("profile", {
            layout: "main",
            activeUser: req.session.userID
        });
    })
    .post((req, res) => {
        const { city, age, homepage } = req.body;
        if (!city && !age && !homepage) {
            res.redirect("/petition");
        } else {
            db.createProfile(
                req.body.city,
                req.body.age,
                req.body.homepage,
                req.session.userID
            )
                .then(session => {
                    console.log(session);
                    res.redirect("/petition");
                })
                .catch(err => console.log(err));
        }
    });
