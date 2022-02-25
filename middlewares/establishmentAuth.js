const jwt = require("jsonwebtoken");
const Establishment = require("../models/Establishment.js");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwtEstablishment;

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.redirect('/establishment/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/establishment/login');
    }
}

const checkEstablishment = (req, res, next) => {
    const token = req.cookies.jwtEstablishment;

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.locals.establishment = null;
                next();
            } else {
                let establishment = await Establishment.findById(decodedToken.id);
                res.locals.establishment = establishment;
                next();
            }
        });
    } else {
        res.locals.establishment = null;
        next();
    }
}

module.exports = {
    requireAuth,
    checkEstablishment
};