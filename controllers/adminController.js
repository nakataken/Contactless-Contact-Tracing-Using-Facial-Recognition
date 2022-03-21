const Request = require("../models/Request.js");

const index_get = (req, res) => {
    res.redirect('/admin/dashboard');
}

const dashboard_get = (req, res) => {
    res.render('./Administrator Module/dashboard');
}

const requests_get = async (req, res) => {
    let requests = await Request.find();
    res.render('./Administrator Module/request', {requests})
}

const request_get = async (req, res) => {
    const request = await Request.findById(req.params.id);
    res.send(request);
}

const logout_get = (req, res) => {
    res.cookie('jwtAdmin', '', {maxAge: 1});
    res.redirect('/');
}

module.exports = {
    index_get,
    logout_get,
    dashboard_get,
    requests_get
}