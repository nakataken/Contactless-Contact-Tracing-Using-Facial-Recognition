const Establishment = require("../models/Establishment.js");
const Request = require("../models/Request.js");
const Visitor = require("../models/Visitor.js");
const Record = require("../models/Record.js");
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
    res.redirect('/establishment/login')
}

const home_get = (req, res) => {
    res.render('./Establishment Module/home');
}

const request_get = (req, res) => {
    res.render('./Establishment Module/request');
}

const login_get = (req, res) => {
    const token = req.cookies.jwtEstablishment
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err) {
                console.log(err.message);
                res.redirect('/');
            } else {
                res.redirect('/establishment/home');
            }
        });
    } else {
        res.render('./Establishment Module/login');
    }
}

const login_error = (res, error, email) => {
    res.render('./Establishment Module/login', {error,email});
}

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

const record_get = (req, res) => {
    res.render('./Establishment Module/record');
}

const logout_get = (req, res) => {
    res.cookie('jwtEstablishment', '', {maxAge: 1});
    res.redirect('/establishment/login');
}

const login_post = (req, res) => {
    const {email, pass} = req.body;

    Establishment.findOne({email:email}, async (err,data) => { 
        if(data){
            const auth = await bcrypt.compare(pass,data.password);

            if(auth) {
                const token = createToken(data.id);
                res.cookie('jwtEstablishment', token, {httpOnly: true, maxAge: maxAge * 1000});
                res.redirect('/establishment/home');
            } else {
                login_error(res, "Wrong email or password", email);
            }
        } else {
            login_error(res, "Wrong email or password", email);
        }
    }); 
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
                res.redirect('/establishment/login');
            } else {
                res.redirect("/establishment/login");
            }
        });
    } catch (error) {
        console.log(error);
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

            const record = new Record({visitor_id, establishment_id});

            record.save((err) => {
                if(err) {
                    console.log(err);
                }
            })  

            res.sendStatus(200)  
        });
    } catch (error) {
        console.log(error.message);
        res.status(401).json(error.message);
    }
}

const test_get = async (req, res) => {
    const name = "Test Establishment";
    const owner = "Test Owner";
    const address = "Test Address";
    const email = "test@gmail.com";
    const contact = "9752991975";
    const password = "Establishment12345";

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const establishment = new Establishment({ establishment_name:name, establishment_owner:owner, establishment_address: address, email, contact, password: hashedPassword});

        establishment.save((err) => {
            if(err) {
                console.log(err);
                res.redirect('/establishment/login');
            } else {
                res.redirect("/establishment/login");
            }
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    index_get,
    home_get,
    login_get,
    login_post,
    request_get,
    request_post,
    logout_get,
    dashboard_get,
    record_get,
    qr_get,
    qr_post,
    test_get
}