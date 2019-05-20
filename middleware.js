module.exports = {
    requireNoSignature
};

function requireNoSignature(req, res, next) {
    if (req.session.signID) {
        res.redirect("/petition/signed");
    } else {
        next();
    }
}
