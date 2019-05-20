module.exports = {
    requireNoSignature,
    requireSignature
};

function requireNoSignature(req, res, next) {
    if (req.session.signID) {
        res.redirect("/petition/signed");
    } else {
        next();
    }
}

function requireSignature(req, res, next) {
    if (!req.session.signID) {
        res.redirect("/petition/signers");
    } else {
        next();
    }
}
