const index_get = (req, res) => {
    res.redirect('/admin/dashboard');
}

const dashboard_get = (req, res) => {
    res.render('./Administrator Module/dashboard');
}

const logout_get = (req, res) => {
    res.cookie('jwtAdmin', '', {maxAge: 1});
    res.redirect('/');
}

module.exports = {
    index_get,
    logout_get,
    dashboard_get
}