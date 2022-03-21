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

const login_register = (req, res, url) => {
    const visitorToken = req.cookies.jwtVisitor;
    const adminToken = req.cookies.jwtAdmin;
    
    if(visitorToken) {
        jwt.verify(visitorToken, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.redirect('/');
            } else {
                res.redirect('/visitor/profile');
            }
        });
    } else if (adminToken) {
        jwt.verify(adminToken, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.redirect('/');
            } else {
                res.redirect('/admin/');
            }
        });
    } else {
        res.render(url);
    }
} 

const register_get = (req, res) => {
    login_register(req, res, "./Visitor Module/register");
}

const login_get = (req, res) => {
    login_register(req, res, "./Visitor Module/login");
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
    const { fname, mi, lname, bdate, contact, email, pass} = req.body;

    const name = {
        fname,
        mi,
        lname
    }

    const address = {
        region: req.body.region,
        province: req.body.province,
        city: req.body.city,
        barangay: req.body.barangay
    }

    let emailError = "";
    let contactError = "";

    try {
        const hashedPassword = await bcrypt.hash(pass, saltRounds);
        const visitor = new Visitor({ name, bdate, address, contact, email, password: hashedPassword});
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
                    const token = createToken(data.id);
                    res.cookie('jwtVisitor', token, {httpOnly: true, maxAge: maxAge * 1000});
                    res.redirect("/visitor/detect/1");
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
                if(data.descriptions.length === 3) {
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
                    Visitor.updateOne({_id:data._id}, { $pull: { descriptions } }, (err, data) => {
                        if(err) {
                            console.log(err);
                            res.redirect('/');
                        } else {
                            res.redirect('/visitor/detect/1');
                        }
                    })
                }
            } else {
                login_error(res, "Wrong email or password", email);
            }
        } else {
            login_error(res, "Wrong email or password", email);
        }
    }); 
}

module.exports = {
    index_get,
    register_get,
    register_post,
    login_get,
    login_post,
    logout_get,
    profile_get,
}