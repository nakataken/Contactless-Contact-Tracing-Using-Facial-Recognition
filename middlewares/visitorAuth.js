import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

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

export default requireAuth;