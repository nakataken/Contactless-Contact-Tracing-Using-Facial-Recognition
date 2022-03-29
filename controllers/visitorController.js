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
                res.redirect('/admin/dashboard');
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
    const token = req.cookies.jwtVisitor;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        qr.toDataURL(decodedToken.id, (err, src) => {
        if (err) {
            console.log(err)
        }
        res.render('./Visitor Module/profile', {src});
        });
    });
}

const details_get = (req, res) => {
    res.render('./Visitor Module/details');
}

const logout_get = (req, res) => {
    res.cookie('jwtVisitor', '', {maxAge: 1});
    res.redirect('/visitor/login');
}

const code_get = (req, res) => {
    try {
        let email = req.params.email;
        let code = Math.floor(100000 + Math.random() * 900000);

        const mailData = {
            from: 'contactrazerist@gmail.com', 
            to: email, 
            subject: 'Register Code',
            text: `Code: ${code}`
        };
        
        mailer.transporter.sendMail(mailData, async function (err, info) {
            if(err) {
                console.log(err)
            } else {
                res.json(code);
            }
        });
    } catch(error) {
        console.log(error.message);
        res.redirect('/');
    }
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
        Visitor.countDocuments({email}, (err, emailCount) => { 
            Visitor.countDocuments({contact}, async (err, contactCount) => { 
                let emailError = false;
                let contactError = false;
                if(emailCount>0) emailError = true;
                if(contactCount>0) contactError = true;

                if(!emailError & !contactError) {
                    const hashedPassword = await bcrypt.hash(req.body.pass, saltRounds);
                    const visitor = new Visitor({name, bdate, address, contact, email:req.body.email, password: hashedPassword});

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
                    res.json({emailError, contactError})
                }
            });
        });
    } catch (error) {
        console.log(error.message);
        res.redirect('/');
    }
}

const login_post = (req, res) => {
    const {email, pass} = req.body;

    Visitor.findOne({email:email}, async (err,data) => { 
        if(data){
            const auth = await bcrypt.compare(pass,data.password);
            if(auth) {
                if(data.descriptions.length === 5) {
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
                    // Make action if descriptions is not clear
                    // Visitor.updateOne({_id:data._id}, { $pull: { descriptions } }, (err, data) => {
                    //     if(err) {
                    //         console.log(err);
                    //         res.redirect('/');
                    //     } else {
                    //         res.redirect('/visitor/detect/1');
                    //     }
                    // })
                }
            } else {
                login_error(res, "Wrong email or password", email);
            }
        } else {
            login_error(res, "Wrong email or password", email);
        }
    }); 
}

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
        await Visitor.updateOne({_id:decodedToken.id}, { $set: { password:hashedPassword }});
        res.redirect('/visitor/details');
    })
}

module.exports = {
    index_get,
    register_get,
    register_post,
    code_get,
    login_get,
    login_post,
    logout_get,
    profile_get,
    details_get,
    oldPassword_post,
    newPassword_put
}