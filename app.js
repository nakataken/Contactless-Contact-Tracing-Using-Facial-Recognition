import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import route from "./routes/route.js";

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');