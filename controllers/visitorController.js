const Visitor = require("../models/Visitor.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const qr = require("qrcode");
const _ = require('lodash'); 
const mailer = require("../middlewares/mailer.js");

const saltRounds = 10;
const maxAge = 3 * 24 * 60 * 60;

// create jwt
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    })
}

// HOME
const index_get = (req, res) => {
    const token = req.cookies.jwtVisitor;
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
            if(error) return;
            Visitor.findOne({_id:decodedToken.id}, (error, visitor) => {
                if(error) return
                if(visitor.descriptions.length < 5 || !visitor.descriptions.length) {
                    res.redirect('/visitor/detect/instruction');
                } else {
                    res.redirect('/visitor/profile');
                }
            })
        });
    } else {
        res.redirect('/visitor/login');
    }
}   

// VALIDATE LOGIN OR REGISTER
const login_register = (req, res, url) => {
    const visitorToken = req.cookies.jwtVisitor;
    const adminToken = req.cookies.jwtAdmin;
    
    if(visitorToken) {
        jwt.verify(visitorToken, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.status(404).redirect('/');
            } else {
                Visitor.findOne({_id:decodedToken.id}, (error, visitor) => {
                    if(error) return;
                    if(!visitor.descriptions.length || visitor.descriptions.length < 5) {
                        res.redirect('/visitor/detect/instruction');
                    } else {
                        res.redirect('/visitor/profile');
                    }
                })
            }
        });
    } else if (adminToken) {
        jwt.verify(adminToken, process.env.JWT_SECRET, (error, decodedToken) => {
            if(error) return;
            res.redirect('/admin/dashboard');
        });
    } else {
        res.render(url);
    }
} 

// REGISTER
const data_privacy_get = (req, res) => {
    login_register(req, res, './Visitor Module/data-privacy');
}

const register_get = (req, res) => {
    login_register(req, res, "./Visitor Module/register");
}

const register_post = async (req, res) => { 
    const email = req.body.email;
    const bdate = new Date(req.body.bdate).toLocaleDateString();
    const contact = req.body.contact;

    const name = {
        fname: _.upperCase(req.body.fname),
        mi: _.upperCase(req.body.mi),
        lname: _.upperCase(req.body.lname)
    }

    const address = {
        region:  _.upperCase(req.body.region),
        province:  _.upperCase(req.body.province),
        city:  _.upperCase(req.body.city),
        barangay:  _.upperCase(req.body.barangay)
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.pass, saltRounds);
        const visitor = new Visitor({name, bdate, address, contact, email, password: hashedPassword});

        visitor.save((err, data) => {
            if(err) {
                console.log(err);
                res.redirect('/visitor/register');
            } else {
                const token = createToken(data.id);
                res.cookie('jwtVisitor', token, {httpOnly: true, maxAge: maxAge * 1000});
                res.redirect("/visitor/detect/instruction");
            }
        })
    } catch (error) {
        console.log(error.message);
        res.status(404).redirect('/');
    }
}

const register_code_get = (req, res) => {
    try {
        let email = req.params.email;
        let code = Math.floor(100000 + Math.random() * 900000);

        const mailData = {
            from: 'contactrazerist@gmail.com', 
            to: email, 
            subject: 'Register Code',
            text: `Code: ${code}`
        };

        Visitor.countDocuments({email}, (err, count) => { 
            if(count==0 || !count) {
                mailer.transporter.sendMail(mailData, async function (error, info) {
                    if(error) return;
                    res.json(code);
                });
            } else {
                res.json({emailError:true})
            }
        })
    } catch(error) {
        console.log(error.message);
        res.status(404).redirect('/');
    }
}

// LOGIN
const login_get = (req, res) => {
    login_register(req, res, "./Visitor Module/login");
}

const login_post = (req, res) => {
    const {email, pass} = req.body;

    Visitor.findOne({email:email}, async (err,data) => { 
        if(data){
            const auth = await bcrypt.compare(pass,data.password);
            if(auth) {
                if(data.descriptions.length === 5) {
                    if(data.isAdmin) {
                        const token = createToken(data.id);
                        res.cookie('jwtAdmin', token, {httpOnly: true, maxAge: maxAge * 1000});
                        res.redirect('/admin/dashboard');
                    } else {
                        const token = createToken(data.id);
                        res.cookie('jwtVisitor', token, {httpOnly: true, maxAge: maxAge * 1000});
                        res.redirect('/visitor/profile');
                    }
                } else {
                    Visitor.findOneAndUpdate({email:email}, { $set: { descriptions:[] }}, (error, visitor) => {
                        if(error) return;
                        if(visitor) {
                            const token = createToken(visitor._id);
                            console.log(visitor._id);
                            res.cookie('jwtVisitor', token, {httpOnly: true, maxAge: maxAge * 1000});
                            res.redirect('/visitor/detect/instruction');
                        }
                    });
                }
            } else {
                login_error(res, "Wrong email or password", email);
            }
        } else {
            login_error(res, "Wrong email or password", email);
        }
    }); 
}

const login_error = (res, error, email) => {
    res.render('./Visitor Module/login', {error,email});
}

const logout_get = (req, res) => {
    res.cookie('jwtVisitor', '', {maxAge: 1});
    res.redirect('/visitor/login');
}

// FORGOT PASSWORD
const forgot_get = (req, res) => {
    res.render('./Visitor Module/forgot-pass');
}

const forgot_post = async (req, res) => {
    const {newPass, emailConfirm} = req.body;
    Visitor.findOne({email:emailConfirm}, async (error, visitor) => {
        if(error) return;
        if(visitor) {
            const hashedPassword = await bcrypt.hash(newPass, saltRounds);
            Visitor.updateOne({_id:visitor._id}, { $set: { password:hashedPassword }}, (error, visitor) => {
                if(error) return;
                if(visitor) res.redirect('/visitor/login');
            });
        }
    })
}

const forgot_code_get = (req, res) => {
    try {
        let email = req.params.email;
        let code = Math.floor(100000 + Math.random() * 900000);

        const mailData = {
            from: 'contactrazerist@gmail.com', 
            to: email, 
            subject: 'Forgot password',
            text: `Code: ${code}`
        };

        Visitor.countDocuments({email}, (err, count) => { 
            if(count>0) {
                mailer.transporter.sendMail(mailData, async function (error, info) {
                    if(error) return;
                    res.json(code);
                });
            } else {
                res.json({emailError:true})
            }
        })
    } catch(error) {
        console.log(error.message);
        res.redirect('/');
    }
}

// PROFILE
const profile_get = (req, res) => {
    const token = req.cookies.jwtVisitor;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        qr.toDataURL(decodedToken.id, (error, src) => {
        if (error) return;
        res.render('./Visitor Module/profile', {src});
        });
    });
}

// DETAILS
const details_get = (req, res) => {
    res.render('./Visitor Module/details');
}

// UPLOAD VACCINATION CARD
const uploadVac_post = (req, res) => {
    const token = req.cookies.jwtVisitor;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        Visitor.updateOne({_id:decodedToken.id}, {$set:{vaccine_card: req.file.filename}}, (error, visitor) => {
            if(error) return;
            res.redirect('/visitor/details');
        })
    });
}

// CHANGE PASSWORD
const oldPassword_post = (req, res) => {
    const token = req.cookies.jwtVisitor;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        Visitor.findById({_id:decodedToken.id}, async (err,data) => { 
            const auth = await bcrypt.compare(req.body.oldPass,data.password);
            if(auth) {
                res.json({success:true});
            } else {
                res.json({success:false});
            }
        })
    })
}

const newPassword_put = (req, res) => {
    const token = req.cookies.jwtVisitor;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        const hashedPassword = await bcrypt.hash(req.body.newPass, saltRounds);
        Visitor.updateOne({_id:decodedToken.id}, { $set: { password:hashedPassword }}, (error, visitor) => {
            if(error) return
            if(visitor) res.redirect('/visitor/details');
        });
    })
}

module.exports = {
    index_get,
    data_privacy_get,
    register_get,
    register_post,
    register_code_get,
    login_get,
    login_post,
    logout_get,
    forgot_get,
    forgot_post,
    forgot_code_get,
    profile_get,
    details_get,
    uploadVac_post,
    oldPassword_post,
    newPassword_put
}