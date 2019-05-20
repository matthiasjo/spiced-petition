const express = require("express");
const router = express.Router();
const db = require("../utils/db");
const { requireNoSignature } = require("../middleware");
const expressSanitizer = require("express-sanitizer");
const bodyParser = require("body-parser");

module.exports = router;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(expressSanitizer());

router
    .route("/profile")
    .get(requireNoSignature, (req, res) => {
        res.render("profile", {
            layout: "main",
            activeUser: req.session.userID
        });
    })
    .post((req, res) => {
        const url = req.sanitize(req.body.homepage);
        const city = req.sanitize(req.body.city);
        const age = req.sanitize(req.body.age);
        if (!city && !age && !url) {
            res.redirect("/petition");
        } else {
            db.createProfile(city, age, url, req.session.userID)
                .then(() => {
                    res.redirect("/petition");
                })
                .catch(err => {
                    console.log(err);
                    res.render("registration", {
                        layout: "main",
                        error: "Wrong input. Try again",
                        activeUser: req.session.userID
                    });
                });
        }
    });
