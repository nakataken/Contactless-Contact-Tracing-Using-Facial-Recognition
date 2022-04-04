const jwt = require("jsonwebtoken");
const Visitor = require("../models/Visitor.js");

const visitorAuth = (req, res, next) => {
    const token = req.cookies.jwtVisitor;

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.redirect('/visitor/login');
            } else {
                next();
            }
        });
    } else {
        res.redirect('/visitor/login');
    }
}

const checkVisitor = (req, res, next) => {
    const token = req.cookies.jwtVisitor;

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.locals.visitor = null;
                next();
            } else {
                let visitor = await Visitor.findById(decodedToken.id);
                res.locals.visitor = visitor;
                next();
            }
        });
    } else {
        res.locals.visitor = null;
        next();
    }
}

const adminAuth = (req, res, next) => {
    const token = req.cookies.jwtAdmin;

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.redirect('/visitor/login');
            } else {
                next();
            }
        });
    } else {
        res.redirect('/visitor/login');
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
                let admin = await Visitor.findById(decodedToken.id);
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
    visitorAuth,
    checkVisitor,
    adminAuth,
    checkAdmin
};