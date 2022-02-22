const index_get = (req, res) => {
    res.render('index');
}

const establishment_get = (req, res) => {
    res.render('establishment');
}

const visitor_get = (req, res) => {
    // res.redirect('/visitor/profile');
    res.redirect('/visitor/login');
}

const about_get = (req, res) => {
    res.render('about');
}

export default {
    index_get,
    establishment_get,
    visitor_get,
    about_get
}