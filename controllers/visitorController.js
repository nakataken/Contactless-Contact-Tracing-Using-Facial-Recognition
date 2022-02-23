import Visitor from "../models/Visitor.js";
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

const register_get = (req, res) => {
    res.render('./Visitor Module/register');
}

const detect_get = (req, res) => {
    res.render('./Visitor Module/face_detect');
}

const login_get = (req, res) => {
    res.render('./Visitor Module/login');
}

const profile_get = (req, res) => {
    res.render('./Visitor Module/profile');
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
        if(emailError == "" && contactError== "") {
            visitor.save((err, data) => {
                if(err) {
                    console.log(err);
                    res.redirect('/visitor/register');
                } else {
                    const token = createToken(data.id);
                    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
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

const detect_post = (req, res) => {
    res.send("DETECT POST");
}   


const login_post = (req, res) => {
    const {email, pass} = req.body;
    // let error = "";

    Visitor.findOne({email:email}, async (err,data) => { 
        if(data){
            const auth = await bcrypt.compare(pass,data.password);

            if(auth) {
                const token = createToken(data.id);
                res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
                res.redirect('/visitor/profile');
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

const logout_post = (req, res) => {
    res.send("LOGOUT POST");
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