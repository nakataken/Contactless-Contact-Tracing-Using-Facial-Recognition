// import Face from "../models/Face.js";
import Establishment from "../models/Establishment.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;
const maxAge = 3 * 24 * 60 * 60;

// create jwt
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    })
}

const home_get = (req, res) => {
    res.render('./Establishment Module/home');
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

const record_post = (req, res) => {
    res.send("Record Post");
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
        const establishment = new Establishment({ establishment_name:name, estbalishment_owner:owner, establishment_address: address, email, contact, password: hashedPassword});

        establishment.save((err, data) => {
            if(err) {
                console.log(err);
                res.redirect('/establishment/login');
            } else {
                const token = createToken(data.id);
                res.cookie('jwtEstabishment', token, {httpOnly: true, maxAge: maxAge * 1000});
                res.redirect("/establishment/login");
            }
        })
    } catch (error) {
        console.log(error);
    }
}

export default {
    home_get,
    login_get,
    login_post,
    logout_get,
    dashboard_get,
    record_get,
    record_post,
    test_get
}