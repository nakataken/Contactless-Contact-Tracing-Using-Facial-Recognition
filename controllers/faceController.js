const Face = require("../models/Face.js");

const detect1_get = (req, res) => {
    res.render('./Visitor Module/detect/1');
}

const detect2_get = (req, res) => {
    res.render('./Visitor Module/detect/2');
}
const detect3_get = (req, res) => {
    res.render('./Visitor Module/detect/3');
}

const detect1_post = async (req, res) => {
    res.json({ redirectRoute: "/visitor/login" });
    // res.redirect('/visitor/login');
}   

const detect2_post = (req, res) => {
    res.send("DETECT 2 POST");
}   

const detect3_post = (req, res) => {
    res.send("DETECT 3 POST");

}   

module.exports = {
    detect1_get, 
    detect1_post,
    detect2_get, 
    detect2_post,
    detect3_get, 
    detect3_post
}