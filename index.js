const express = require("express");
const serveStatic = require("serve-static");
const db = require("./utils/db");
const bc = require("./utils/bc");
const hb = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

// (optional) partials for nav handlebars

const app = express();
const port = 8080;
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
    cookieSession({
        name: "session",
        secret: `trail of cookie crumbs to the secret.`,
        // Cookie Options
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })
);

app.get("/registration", (req, res) => {
    res.render("registration", {
        layout: "main",
        siteName: "Petition registration"
    });
});

app.post("/registration", (req, res) => {
    bc.hashPassword(req.body.password)
        .then(pwHash => {
            db.addUser(
                req.body.firstName,
                req.body.lastName,
                req.body.email,
                pwHash
            )
                .then(session => {
                    req.session.userID = session.rows[0].id;
                    req.session.firstName = session.rows[0].name;
                    req.session.lastName = session.rows[0].surname;
                    res.redirect("/profile");
                })
                .catch(err => console.log(err));
        })
        .catch(err => {
            // if invalid input render registration with error
            console.log(err);
        });
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main",
        siteName: "We need more information"
    });
});
app.post("/profile", (req, res) => {
    db.createProfile(
        req.body.city,
        req.body.age,
        req.body.personalHomepage,
        req.session.userID
    )
        .then(session => {
            console.log(session);
            res.redirect("/petition");
        })
        .catch(err => console.log(err));
});

app.get("/petition", (req, res) => {
    if (req.session.signatureId) {
        res.redirect("/petition/signed");
    } else {
        res.render("petition", {
            layout: "main",
            siteName: "Save the Bees",
            first: req.session.firstName,
            last: req.session.lastName
        });
    }
});

app.post("/petition", (req, res) => {
    db.addSignature(req.body.signature, req.session.userID)
        .then(qResponse => {
            req.session.signID = qResponse.rows[0].id;
            res.redirect("/petition/signed");
        })
        .catch(err => {
            console.log(err);
            res.render("petition", {
                layout: "main",
                siteName: "Save the Bees",
                error: "Wrong input. Try again"
            });
        });
});

app.get("/petition/signed", (req, res) => {
    Promise.all([db.getCount(), db.getSignature(req.session.signID)])
        .then(results => {
            res.render("signed", {
                layout: "main",
                siteName: "Thank you for supporting this cause",
                signatureUrl: results[1].rows[0].signature,
                numSigner: results[0].rows[0].count
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/petition/signers", (req, res) => {
    db.getList()
        .then(qResponse => {
            console.log(qResponse);
            res.render("signers", {
                layout: "main",
                siteName: "List of worker Bees",
                Data: qResponse.rows
                //sumSigners: req.session.id
            });
        })
        .catch(err => console.log(err));
});

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main",
        siteName: "Petition login"
    });
});

app.get("/petition/signers/:city", (req, res) => {
    db.getCityList(req.params.city)
        .then(qResponse => {
            res.render("signers", {
                layout: "main",
                siteName: "List of worker Bees",
                Data: qResponse.rows
                // sumSigners: req.session.id
            });
        })
        .catch(err => console.log(err));
});

app.post("/login", (req, res) => {
    db.loginUser(req.body.email)
        .then(userInfo => {
            const pwHash = userInfo.rows[0].password;
            bc.checkPassword(req.body.password, pwHash)
                .then(result => {
                    req.session.userID = userInfo.rows[0].user_id;
                    req.session.signID = userInfo.rows[0].sign_id;
                    console.log(result);
                    res.redirect("/petition/signers");
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

app.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});

app.use(serveStatic("./public"));

app.listen(port, () => console.log(`This server is listening on port ${port}`));
