import Visitor from "../models/Visitor.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import e from "express";

const saltRounds = 10;
const maxAge = 3 * 24 * 60 * 60;

// create jwt
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    })
}

const register_get = (req, res) => {
    res.render('./Visitor Module/register');
}

const register_post = async (req, res) => { 
    const { fname, mi, lname, bdate, barangay, city, province, contact, email, pass} = req.body;

    let emailError = "";
    let contactError = "";

    try {
        const hashedPassword = await bcrypt.hash(pass, saltRounds);
        const visitor = new Visitor({ fname, mi, lname, bdate, barangay, city, province, contact, email, password: hashedPassword });

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

        visitor.save((err, data) => {
            if(err || emailError || contactError) {
                res.render('./Visitor Module/register', {fname, mi, lname, bdate, email: passEmail, contact:passContact, emailError, contactError});
            } else {
                const token = createToken(data.id);
                res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
                res.redirect("/visitor/login");
            }
        })
    } catch (error) {
        console.log(error);
    }
}

const detect_get = (req, res) => {
    res.render('./Visitor Module/face_detect');
}

const detect_post = (req, res) => {
    res.send("DETECT POST");
}   

const login_get = (req, res) => {
    res.render('./Visitor Module/login');
}

const login_post = (req, res) => {

}

const logout_post = (req, res) => {
    res.send("LOGOUT POST");
}

const profile_get = (req, res) => {
    res.render('./Visitor Module/profile');
}

export default {
    register_get,
    register_post,
    detect_get, 
    detect_post,
    login_get,
    login_post,
    logout_post,
    profile_get
}