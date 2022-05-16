const Establishment = require("../models/Establishment.js");
const Request = require("../models/Request.js");
const Visitor = require("../models/Visitor.js");
const Record = require("../models/Record.js");
const bcrypt = require("bcrypt");
const mailer = require("../middlewares/mailer.js");
const jwt = require("jsonwebtoken");
const _ = require('lodash'); 
const saltRounds = 10;
const maxAge = 3 * 24 * 60 * 60;

// create jwt
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    })
}

// INDEX
const index_get = (req, res) => {
    res.redirect('/establishment/login')
}

// REQUEST
const request_get = (req, res) => {
    res.render('./Establishment Module/request');
}

const request_post = async (req, res) => {
    let request = new Request({
        name: req.body.name,
        owner: req.body.owner,
        email: req.body.email,
        address: req.body.address,
        contact: req.body.contact,
        message: req.body.message,
        permit: req.files.permit[0].filename,
        validID: req.files.validID[0].filename
    })

    try {
        request.save((err) => {
            if(err) {
                console.log(err);
            } 
            res.redirect('/establishment/login');
        });
    } catch (error) {
        console.log(error);
    }
}

const request_code_get = (req, res) => {
    try {
        let email = req.params.email;
        let code = Math.floor(100000 + Math.random() * 900000);

        const mailData = {
            from: 'contactrazerist@gmail.com', 
            to: email, 
            subject: 'Request Code',
            text: `Code: ${code}`
        };

        Establishment.countDocuments({email}, (error, count) => { 
            if(error) return
            if(count==0 || !count) {
                mailer.transporter.sendMail(mailData, async function (err, info) {
                    if(err) return
                    res.json(code);
                });
            } else {
                res.json({emailError:true});
            }
        });
    } catch(error) {
        console.log(error);
    }
}

// LOGIN
const login_get = (req, res) => {
    const token = req.cookies.jwtEstablishment
    
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.redirect('/');
            } else {
                res.redirect('/establishment/dashboard');
            }
        });
    } else {
        res.render('./Establishment Module/login');
    }
}

const login_post = (req, res) => {
    const {email, pass} = req.body;

    Establishment.findOne({email:email}, async (err,data) => { 
        if(data){
            const auth = await bcrypt.compare(pass,data.password);

            if(auth) {
                const token = createToken(data.id);
                res.cookie('jwtEstablishment', token, {httpOnly: true, maxAge: maxAge * 1000});
                res.redirect('/establishment/dashboard');
            } else {
                login_error(res, "Wrong email or password", email);
            }
        } else {
            login_error(res, "Wrong email or password", email);
        }
    }); 
} 

const login_error = (res, error, email) => {
    res.render('./Establishment Module/login', {error,email});
}

// FORGOT PASSWORD
const forgot_get = (req, res) => {
    res.render('./Establishment Module/forgot-pass');
}

const forgot_post = (req, res) => {
    const {newPass, emailConfirm} = req.body;
    Establishment.findOne({email:emailConfirm}, async (error, establishment) => {
        if(error) return
        if(establishment) {
            const hashedPassword = await bcrypt.hash(newPass, saltRounds);
            Establishment.updateOne({_id:establishment._id}, { $set: { password:hashedPassword }}, (error, establishment) => {
                if(error) return
                if(establishment) res.redirect('/establishment/login');
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

        Establishment.countDocuments({email}, (err, count) => { 
            if(count>0) {
                mailer.transporter.sendMail(mailData, async function (error, info) {
                    if(error) return
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

// LOGOUT
const logout_get = (req, res) => {
    res.cookie('jwtEstablishment', '', {maxAge: 1});
    res.redirect('/establishment/login');
}

// DETAILS
const details_get = (req, res) => {
    res.render('./Establishment Module/details');
}

// CHANGE LIMIT
const updateLimit_put = (req, res) => {
    const token = req.cookies.jwtEstablishment;
    let status = req.body.status;

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        Establishment.updateOne({_id:decodedToken.id}, { $set: { limitVaccinated:status}}, (error, establishment) => {
            if(error) return;
            if(establishment) {
                res.json({success:true})
            } else {
                res.json({success:false})
            }
        });
    });
}

// CHANGE PASSWORD
const oldPassword_post = (req, res) => {
    const token = req.cookies.jwtEstablishment;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        Establishment.findById({_id:decodedToken.id}, async (err,data) => { 
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
    const token = req.cookies.jwtEstablishment;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        const hashedPassword = await bcrypt.hash(req.body.newPass, saltRounds);
        Establishment.updateOne({_id:decodedToken.id}, { $set: { password:hashedPassword }}, (error, establishment) => {
            if(error) return
            if(establishment) res.redirect('/establishment/details');
        });
    })
}


// DASHBOARD
const dashboard_get = async (req, res) => {
    const token = req.cookies.jwtEstablishment;

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.redirect('/');
            } else {
                let logs = [];
                let records = await Record.find({establishment_id:decodedToken.id});
                let visitors = await Visitor.find();

                let recordsCount = records.length;

                for (const record of records) {
                    for (const visitor of visitors) {
                        if(record.visitor_id === visitor._id.toString()) {
                            const log = {
                                id: record.visitor_id, 
                                name: `${visitor.name.fname} ${visitor.name.mi} ${visitor.name.lname}`,
                                date: record.createdAt
                            };
                            logs.push(log);
                        }
                    }
                }

                res.render('./Establishment Module/dashboard', {logs, recordsCount});
            }
        });
    } else {
        res.render('./Establishment Module/login');
    }
}

const qr_get = (req, res) => {
    res.render('./Establishment Module/qr');
}

const qr_post = (req, res) => {
    try {
        const token = req.cookies.jwtEstablishment;

        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            let visitor_id = req.body.decodedText;
            let establishment_id = decodedToken.id;
            const establishment = await Establishment.findById(establishment_id);
            const visitor = await Visitor.findById(visitor_id);

            if(establishment.limitVaccinated) {
                if(visitor.isVaccinated) {
                    const record = new Record({visitor_id, establishment_id});
                    await record.save();
                    res.json({success:true, message:`${visitor.name.fname} ${visitor.name.lname}, you are not vaccinated.`});
                } else {
                    res.json({success:false, message: `${visitor.name.fname} ${visitor.name.lname}`});
                }
            } else {
                const record = new Record({visitor_id, establishment_id});
                await record.save();
                res.json({success:true, message:`${visitor.name.fname} ${visitor.name.lname}`});
            }

        });
    } catch (error) {
        console.log(error.message);
        res.status(401).json(error.message);
    }
}

module.exports = {
    index_get,
    request_get,
    request_post,
    request_code_get,
    login_get,
    login_post,
    forgot_get,
    forgot_post,
    forgot_code_get,
    logout_get,
    details_get,
    updateLimit_put,
    oldPassword_post,
    newPassword_put,
    dashboard_get,
    qr_get,
    qr_post
}