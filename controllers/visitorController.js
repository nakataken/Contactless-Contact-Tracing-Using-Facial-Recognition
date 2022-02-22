import Visitor from "../models/Visitor.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

const register_get = (req, res) => {
    res.render('./Visitor Module/register');
}

// Insert error handling, and checking of data in front-end
// Unique email & contact # 
// JQUERY addresses in front-end
// Password validation

const register_post = async (req, res) => { 
    const { fname, mi, lname, bdate, barangay, city, province, contact, email, pass} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(pass, saltRounds);
        const visitor = new Visitor({ fname, mi, lname, bdate, barangay, city, province, contact, email, password: hashedPassword });
        
        visitor.save((err) => {
            if(err) {
                // Redirect to login with error messages 
                console.log(err);
            } else {
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