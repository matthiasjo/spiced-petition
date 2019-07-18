const express = require("express");
const serveStatic = require("serve-static");
const db = require("./utils/db");
//const bc = require("./utils/bc");
const hb = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const helmet = require("helmet");
//const { requireNoSignature } = require("./middleware");
const profileRouter = require("./routers/profile");
const editProfileRouter = require("./routers/editProfile");
const registerRouter = require("./routers/registration");
const loginRouter = require("./routers/login");
const petitionRouter = require("./routers/petition");
const signersRouter = require("./routers/signers");
const thankYouRouter = require("./routers/thankYou");

///////////////////////// LOGGING \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const winston = require("winston");
///////////////////////// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "user-service" },
    transports: [
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        new winston.transports.Console(),
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" })
    ]
});

const app = express();
exports.app = app;
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

app.get("/test", (req, res) => {
    if (!req.session.whatever) {
        res.redirect("/registration");
    } else {
        res.send(`<h1>test site</h1>`);
    }
});

app.use(registerRouter);

app.use(profileRouter);

app.use(petitionRouter);

app.use(thankYouRouter);

app.use(signersRouter);

app.use(loginRouter);

app.use(editProfileRouter);

app.post("/deleteSignature", (req, res) => {
    db.deleteSignature(req.session.signID)
        .then(() => {
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
        .catch(err => console.log(err));
});

app.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});

app.use(serveStatic("./public"));

if (require.main == module) {
    app.listen(process.env.PORT || port, () =>
        logger.log("info", `This server is listening on port ${port}`)
    );
}
