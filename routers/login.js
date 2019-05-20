const express = require("express");
const router = express.Router();
const db = require("../utils/db");
const bc = require("../utils/db");
//const { requireNoSignature } = require("../middleware");
const expressSanitizer = require("express-sanitizer");
const bodyParser = require("body-parser");

module.exports = router;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(expressSanitizer());

router
    .route("/login")
    .get((req, res) => {
        if (!req.session.userID) {
            res.render("login", {
                layout: "main",
                activeUser: req.session.userID
            });
        } else {
            res.redirect("/");
        }
    })
    .post((req, res) => {
        console.log("MAIL", req.sanitize(req.body.email));
        db.selectUser(req.sanitize(req.body.email))
            .then(qResponse => {
                const pwHash = qResponse.rows[0].password;
                bc.checkPassword(req.body.password, pwHash)
                    .then(pwMatch => {
                        if (pwMatch == true) {
                            req.session.userID = qResponse.rows[0].user_id;
                            req.session.signID = qResponse.rows[0].sign_id;
                            req.session.email = qResponse.rows[0].email;
                            res.redirect("/petition/signers");
                        } else {
                            throw new Error("wrong password");
                        }
                    })
                    .catch(err => {
                        res.render("login", {
                            layout: "main",
                            activeUser: req.session.userID,
                            error: err.message
                        });
                    });
            })
            .catch(err => {
                console.log(err);
                res.render("login", {
                    layout: "main",
                    activeUser: req.session.userID,
                    error: "You don't seem part of the hive!"
                });
            });
    });
