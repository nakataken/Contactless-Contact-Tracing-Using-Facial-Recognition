const index_get = (req, res) => {
    res.redirect('/admin/dashboard');
}

const login_get = (req, res) => {
    res.render('./Administrator Module/login');
}

const login_post = (req, res) => {
    res.send("Login Post");
} 

const logout_post = (req, res) => {
    res.send("Logout Post");
}

const dashboard_get = (req, res) => {
    res.render('./Administrator Module/dashboard');
}

export default {
    index_get,
    login_get,
    login_post,
    logout_post,
    dashboard_get
}