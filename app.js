const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const homeRoute = require("./routes/homeRoute.js");
const visitorRoute = require("./routes/visitorRoutes.js");
const establishmentRoute = require("./routes/establishmentRoutes.js");
const adminRoute = require("./routes/adminRoutes.js");

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.json({limit: '50mb'}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));
app.set('view engine', 'ejs');

const dbURI = process.env.DB_URI;

mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> {
        app.listen(process.env.PORT || 3000, () => {
            console.log('\x1b[36m Server started on http://localhost:3000 ... \x1b[0m');
            console.log('\x1b[36m Connected to the database... \x1b[0m');
        })
    })
    .catch((error)=> console.log(error))

app.use(homeRoute);
app.use("/visitor", visitorRoute);
app.use("/establishment", establishmentRoute);
app.use("/admin", adminRoute);
