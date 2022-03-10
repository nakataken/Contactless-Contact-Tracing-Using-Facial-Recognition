// const Face = require("../models/Face.js";
const Establishment = require("../models/Establishment.js");
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
    res.render('./Establishment Module/login');
}

const login_error = (res, error, email) => {
    res.render('./Establishment Module/login', {error,email});
}

const dashboard_get = (req, res) => {
    res.render('./Establishment Module/dashboard');
}

const record_get = (req, res) => {
    res.render('./Establishment Module/record');
}

const logout_get = (req, res) => {
    res.cookie('jwtEstablishment', '', {maxAge: 1});
    res.redirect('/Establishment/login');
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

const request_post = (req, res) => {
    res.send("Record Post");
}

const record_post = (req, res) => {
    const {visitorID, establishmentID, date} = req.body;

    const record = new Record({visitor: visitorID, establishment: establishmentID, date});

    record.save((err, data) => {
        if(err) {
            console.log(err);
        } else {
            res.send("Record Post");
        }
    })    
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

        establishment.save((err, data) => {
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
    record_post,
    test_get
}