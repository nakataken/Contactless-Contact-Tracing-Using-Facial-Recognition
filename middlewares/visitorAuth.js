import jwt from "jsonwebtoken";
import Visitor from "../models/Visitor.js";

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwtVisitor;

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.redirect('/visitor/login');
            } else {
                console.log(decodedToken);
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

export default {
    requireAuth,
    checkVisitor
};