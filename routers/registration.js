const express = require("express");
const router = express.Router();
const db = require("../utils/db");
const bc = require("../utils/bc");

module.exports = router;

router
    .route("/registration")
    .get((req, res) => {
        res.render("registration", {
            layout: "main",
            activeUser: req.session.userID
        });
    })
    .post((req, res) => {
        if (req.session.userID) {
            res.redirect("/editProfile");
        }
        bc.hashPassword(req.body.password)
            .then(pwHash => {
                db.addUser(
                    req.body.firstName,
                    req.body.lastName,
                    req.body.email,
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
                res.render("registration", {
                    layout: "main",
                    error: "Wrong input. Try again",
                    activeUser: req.session.userID
                });
                console.log(err);
            });
    });
