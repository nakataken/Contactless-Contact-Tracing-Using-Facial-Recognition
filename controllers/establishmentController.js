// import Face from "../models/Face.js";
// import Establishment from "../models/Establishment.js";

const login_get = (req, res) => {
    res.render('./Establishment Module/login');
}

const login_post = (req, res) => {
    res.send("Login Post");
} 

const logout_post = (req, res) => {
    res.send("Logout Post");
}

const dashboard_get = (req, res) => {
    res.render('./Establishment Module/dashboard');
}

export default {
    login_get,
    login_post,
    logout_post,
    dashboard_get
}