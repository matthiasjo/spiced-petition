const express = require("express");
const serveStatic = require("serve-static");
const db = require("./utils/db");
const bc = require("./utils/bc");
const hb = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const helmet = require("helmet");

// TODO error handling.
// TODO code cleaning.
// TODO maybe more security?
// redirect from petition to list if signed
// TODO TEXT

const app = express();
app.use(helmet());
const port = 8080;
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    cookieSession({
        name: "session",
        secret: `trail of cookie crumbs to the secret.`,
        // Cookie Options
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })
);

app.use(csurf());
app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    res.setHeader(`X-FRAME-OPTIONS`, `DENY`);
    next();
});

app.get("/", (req, res) => {
    res.render("home", {
        layout: "main",
        activeUser: req.session.userID
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        layout: "main",
        activeUser: req.session.userID
    });
});

app.get("/registration", (req, res) => {
    res.render("registration", {
        layout: "main",
        activeUser: req.session.userID
    });
});

app.post("/registration", (req, res) => {
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

app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main",
        activeUser: req.session.userID
    });
});
app.post("/profile", (req, res) => {
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

app.get("/petition", (req, res) => {
    if (req.session.signID) {
        res.redirect("/petition/signed");
    } else {
        res.render("petition", {
            layout: "main",
            first: req.session.firstName,
            last: req.session.lastName,
            activeUser: req.session.userID
        });
    }
});

app.post("/petition", (req, res) => {
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

app.get("/petition/signed", (req, res) => {
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

app.get("/petition/signers", (req, res) => {
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

app.get("/petition/signers/:city", (req, res) => {
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

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main",
        activeUser: req.session.userID
    });
});

app.post("/login", (req, res) => {
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

app.get("/editProfile", (req, res) => {
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
});

app.post("/editProfile", (req, res) => {
    const { firstName, lastName, email, password, age, city, url } = req.body;
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
                //password
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
        db.selectUser(req.body.email)
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

app.post("/deleteSignature", (req, res) => {
    db.deleteSignature(req.session.signID)
        .then(qResponse => {
            delete req.session.signID;
            res.redirect("/petition");
        })
        .catch(err => console.log(err));
});

app.post("/deleteAccount", (req, res) => {
    db.deleteAccount(req.session.userID)
        .then(result => {
            console.log(result);
            req.session = null;
            delete req.session;
            res.redirect("/");
        })
        .catch(console.log(err));
});

app.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});

app.use(serveStatic("./public"));

app.listen(process.env.PORT || port, () =>
    console.log(`This server is listening on port ${port}`)
);
