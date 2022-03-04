const Visitor = require("../models/Visitor.js");
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
    res.redirect('/visitor/profile');
}

const register_get = (req, res) => {
    res.render('./Visitor Module/register');
}

const detect1_get = (req, res) => {
    res.render('./Visitor Module/detect/1');
}

const detect2_get = (req, res) => {
    res.render('./Visitor Module/detect/2');
}
const detect3_get = (req, res) => {
    res.render('./Visitor Module/detect/3');
}

const login_get = (req, res) => {
    res.render('./Visitor Module/login');
}

const login_error = (res, error, email) => {
    res.render('./Visitor Module/login', {error,email});
}

const profile_get = (req, res) => {
    res.render('./Visitor Module/profile');
}

const logout_get = (req, res) => {
    res.cookie('jwtVisitor', '', {maxAge: 1});
    res.redirect('/visitor/login');
}

const register_post = async (req, res) => { 
    const { fname, mi, lname, bdate, barangay, city, province, contact, email, pass} = req.body;

    let emailError = "";
    let contactError = "";

    try {
        const hashedPassword = await bcrypt.hash(pass, saltRounds);
        const visitor = new Visitor({ fname, mi, lname, bdate, barangay, city, province, contact, email, password: hashedPassword});
        let passEmail;
        let passContact;

        // Unique Email
        Visitor.countDocuments({email:visitor.email}, (err, count) => { 
            if(count>0){
                emailError = "Email already exists";
                console.log(emailError);  
            } else {
                passEmail = email;
            }
        }); 

        // Unique Contact
        Visitor.countDocuments({contact:visitor.contact}, (err, count) => { 
            if(count>0){
                contactError = "Contact already exists";
                console.log(contactError);  
            } else {
                passContact = contact;
            }
        });
        if(emailError == "" && contactError== "") {
            visitor.save((err, data) => {
                if(err) {
                    console.log(err);
                    res.redirect('/visitor/register');
                } else {
                    res.redirect("/visitor/login");
                }
            })
        } else {
            res.render('./Visitor Module/register', {fname, mi, lname, bdate, email: passEmail, contact:passContact, emailError, contactError});
        }
        
    } catch (error) {
        console.log(error);
    }
}

const login_post = (req, res) => {
    const {email, pass} = req.body;

    Visitor.findOne({email:email}, async (err,data) => { 
        if(data){
            const auth = await bcrypt.compare(pass,data.password);
            if(auth) {
                if(data.usertype === "sysadmin") {
                    const token = createToken(data.id);
                    res.cookie('jwtAdmin', token, {httpOnly: true, maxAge: maxAge * 1000});
                    res.redirect('/admin/dashboard');
                } else {
                    const token = createToken(data.id);
                    res.cookie('jwtVisitor', token, {httpOnly: true, maxAge: maxAge * 1000});
                    res.redirect('/visitor/profile');
                }
            } else {
                login_error(res, "Wrong email or password", email);
            }
        } else {
            login_error(res, "Wrong email or password", email);
        }
    }); 
}

const detect1_post = async (req, res) => {
    res.json({ redirectRoute: "/visitor/login" });
    // res.redirect('/visitor/login');
}   

const detect2_post = (req, res) => {
    res.send("DETECT 2 POST");
}   

const detect3_post = (req, res) => {
    res.send("DETECT 3 POST");
}   

module.exports = {
    index_get,
    register_get,
    register_post,
    login_get,
    login_post,
    logout_get,
    profile_get,
    detect1_get, 
    detect1_post,
    detect2_get, 
    detect2_post,
    detect3_get, 
    detect3_post
}