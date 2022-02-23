import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import homeRoute from "./routes/homeRoute.js";
import visitorRoute from "./routes/visitorRoutes.js";
import establishmentRoute from "./routes/establishmentRoutes.js";
import adminRoute from "./routes/adminRoutes.js";

const env = dotenv.config();
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
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
app.use(visitorRoute);
app.use(establishmentRoute);
app.use(adminRoute);