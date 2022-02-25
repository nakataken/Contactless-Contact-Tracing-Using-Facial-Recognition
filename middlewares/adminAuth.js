const jwt = require("jsonwebtoken");
const Administrator = require("../models/Admin.js");

// Usertypes: Super, System, Manager
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwtAdmin;

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.redirect('/admin/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/admin/login');
    }
}

const checkAdmin = (req, res, next) => {
    const token = req.cookies.jwtAdmin;

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.locals.admin = null;
                next();
            } else {
                let admin = await Administrator.findById(decodedToken.id);
                res.locals.admin = admin;
                next();
            }
        });
    } else {
        res.locals.admin = null;
        next();
    }
}
module.exports = {
    requireAuth,
    checkAdmin
};