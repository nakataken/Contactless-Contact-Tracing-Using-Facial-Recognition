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

const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster.y0biq.mongodb.net/Capstone?retryWrites=true&w=majority`;

mongoose.connect(dbURI, 
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        app.listen(3000, () => {
            console.log("Server started on port 3000 and connected to Database");
        });
    })
    .catch((error) => {
        console.log(error);
    })

app.use(homeRoute);
app.use("/visitor",visitorRoute);
app.use("/establishment",establishmentRoute);
app.use("/admin", adminRoute);
