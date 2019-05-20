const express = require("express");
const router = express.Router();
const db = require("../utils/db");
const bc = require("../utils/bc");
const expressSanitizer = require("express-sanitizer");
const bodyParser = require("body-parser");

module.exports = router;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(expressSanitizer());

router
    .route("/registration")
    .get((req, res) => {
        if (!req.session.userID) {
            res.render("registration", {
                layout: "main",
                activeUser: req.session.userID
            });
        } else {
            res.redirect("/petition");
        }
    })
    .post((req, res) => {
        if (req.session.userID) {
            res.redirect("/editProfile");
        }
        bc.hashPassword(req.body.password)
            .then(pwHash => {
                db.addUser(
                    req.sanitize(req.body.firstName),
                    req.sanitize(req.body.lastName),
                    req.sanitize(req.body.email),
                    pwHash
                )
                    .then(qResponse => {
                        req.session.userID = qResponse.rows[0].id;
                        req.session.firstName = qResponse.rows[0].name;
                        req.session.lastName = qResponse.rows[0].surname;
                        req.session.email = qResponse.rows[0].email;
                        res.redirect("/profile");
                    })
                    .catch(err => {
                        console.log(err);
                        res.render("registration", {
                            layout: "main",
                            error: "Wrong input. Try again",
                            activeUser: req.session.userID
                        });
                    });
            })
            .catch(err => {
                console.log(err);
                res.render("registration", {
                    layout: "main",
                    error: "Wrong input. Try again",
                    activeUser: req.session.userID
                });
            });
    });
