const express = require("express");
const router = express.Router();
const db = require("../utils/db");
const bc = require("../utils/bc");
const { requireNoSignature } = require("../middleware");
const expressSanitizer = require("express-sanitizer");
const bodyParser = require("body-parser");

module.exports = router;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(expressSanitizer());

router
    .route("/editProfile")
    .get((req, res) => {
        db.selectUser(req.session.email)
            .then(qResponse => {
                res.render("editProfile", {
                    layout: "main",
                    Data: qResponse.rows,
                    signature: qResponse.rows[0].signature,
                    activeUser: req.session.userID
                });
            })
            .catch(err => console.log(err));
    })
    .post((req, res) => {
        const firstName = req.sanitize(req.body.firstName);
        const lastName = req.sanitize(req.body.lastName);
        const email = req.sanitize(req.body.email);
        const url = req.sanitize(req.body.homepage);
        const city = req.sanitize(req.body.city);
        const age = req.sanitize(req.body.age);
        const editProfile = async () => {
            try {
                const hashPW = await bc.hashPassword(req.body.password);
                const userUpdate = await db.updateUser(
                    firstName,
                    lastName,
                    email,
                    hashPW,
                    req.session.userID
                );
                const upsertProfile = await db.upsertUserProfile(
                    city,
                    age,
                    url,
                    req.session.userID
                );
            } catch {
                const userUpdate = await db.updateUser(
                    firstName,
                    lastName,
                    email,
                    req.session.userID
                );
                const upsertProfile = await db.upsertUserProfile(
                    city,
                    age,
                    url,
                    req.session.userID
                );
            }
        };
        editProfile().then(result => {
            db.selectUser(req.sanitize(req.body.email))
                .then(qResponse => {
                    req.session.email = qResponse.rows[0].email;
                    res.render("editProfile", {
                        layout: "main",
                        message: "Profile update complete!",
                        Data: qResponse.rows,
                        signature: qResponse.rows[0].signature,
                        activeUser: req.session.userID
                    });
                })
                .catch(err => console.log(err));
        });
    });
