const express = require("express");
const serveStatic = require("serve-static");
const db = require("./utils/db");
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

app.get("/petition", (req, res) => {
    if (req.session.id) {
        res.redirect("/petition/signed");
    } else {
        res.render("home", {
            layout: "main",
            siteName: "Save the Bees"
        });
    }
});

app.post("/petition", (req, res) => {
    if (
        req.body.firstName == "" ||
        req.body.lastName == "" ||
        req.body.signature == ""
    ) {
        res.render("home", {
            layout: "main",
            siteName: "Save the Bees",
            error: "Wrong input. Try again"
        });
    } else {
        db.addSignature(
            req.body.firstName,
            req.body.lastName,
            req.body.signature
        )
            .then(session => {
                // create cookie with returned id
                const sessionID = session.rows[0].id;
                req.session.id = sessionID;
                res.redirect("/petition/signed");
            })
            .catch(err => {
                console.log(err);
            });
    }
});

app.get("/petition/signed", (req, res) => {
    db.getSignature(req.session.id)
        .then(signatureQuery => {
            res.render("signed", {
                layout: "main",
                siteName: "Thank you for supporting this cause",
                signatureUrl: signatureQuery.rows[0].signature,
                numSigner: req.session.id
            });
        })
        .catch(err => console.log(err));
});

app.get("/petition/signers", (req, res) => {
    db.getNames()
        .then(namesQuery => {
            const names = namesQuery.rows;
            //.splice(20);
            res.render("signers", {
                layout: "main",
                siteName: "List of worker Bees",
                names: names,
                sumSigners: req.session.id
            });
        })
        .catch(err => console.log(err));
});

app.use(serveStatic("./public"));

app.listen(port, () => console.log(`This server is listening on port ${port}`));
