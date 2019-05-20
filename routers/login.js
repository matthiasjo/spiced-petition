const express = require("express");
const router = express.Router();
const db = require("../utils/db");
const bc = require("../utils/db");
//const { requireNoSignature } = require("../middleware");

module.exports = router;

router
    .route("/login")
    .get((req, res) => {
        res.render("login", {
            layout: "main",
            activeUser: req.session.userID
        });
    })
    .post((req, res) => {
        db.selectUser(req.body.email)
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
            .catch(err => console.log(err));
    });
