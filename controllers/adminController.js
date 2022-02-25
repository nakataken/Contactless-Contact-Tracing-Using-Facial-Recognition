const Administrator = require("../models/Admin.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
const maxAge = 3 * 24 * 60 * 60;

// create jwt
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    })
}

const index_get = (req, res) => {
    res.redirect('/admin/dashboard');
}

const login_get = (req, res) => {
    res.render('./Administrator Module/login');
}

const dashboard_get = (req, res) => {
    res.render('./Administrator Module/dashboard');
}

const logout_get = (req, res) => {
    res.cookie('jwtAdmin', '', {maxAge: 1});
    res.redirect('/admin/login');
}

const login_post = (req, res) => {
    const {email, pass} = req.body;

    Administrator.findOne({email:email}, async (err,data) => { 
        if(data){
            const auth = await bcrypt.compare(pass,data.password);

            if(auth) {
                const token = createToken(data.id);
                res.cookie('jwtAdmin', token, {httpOnly: true, maxAge: maxAge * 1000});
                res.redirect('/admin/dashboard');
            } else {
                login_error(res, "Wrong email or password", email);
            }
        } else {
            login_error(res, "Wrong email or password", email);
        }
    }); 
} 

const test_get = async (req, res) => {
    const email = "super.admin@gmail.com";
    const password = "Admin12345";
    const admin_type = "Super";

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const admin = new Administrator({ email, password: hashedPassword, admin_type});

        admin.save((err, data) => {
            if(err) {
                console.log(err);
                res.redirect('/admin/login');
            } else {
                // const token = createToken(data.id);
                // res.cookie('jwtAdmin', token, {httpOnly: true, maxAge: maxAge * 1000});
                res.redirect("/admin/login");
            }
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    index_get,
    login_get,
    login_post,
    logout_get,
    dashboard_get,
    test_get
}