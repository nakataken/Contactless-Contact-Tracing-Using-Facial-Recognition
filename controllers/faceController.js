const jwt = require("jsonwebtoken");
const Visitor = require("../models/Visitor.js");
const {Canvas, Image} = require("canvas");
const faceapi = require("face-api.js");
faceapi.env.monkeyPatch({ Canvas, Image });

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
    try {
        const token = req.cookies.jwtVisitor;

        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            const description = req.body.description;

            Visitor.updateOne({ _id: decodedToken.id },{$push: { descriptions: description }}, (error) => {
                if(error) {
                    console.log(error);
                } else {
                    res.redirect('/visitor/detect/2'); 
                }
            })
        });
    } catch (error) {
        console.log(error);
    }
}   

const detect2_post = (req, res) => {
    try{
        const token = req.cookies.jwtVisitor;

        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            const description = req.body.description;

            Visitor.updateOne({ _id: decodedToken.id },{$push: { descriptions: description }}, (error) => {
                if(error) {
                    console.log(error);
                } else {
                    res.redirect('/visitor/detect/3'); 
                }
            })
        });
    } catch (error) {
        console.log(error);
    }
}   

const detect3_post = (req, res) => {
    try{
        const token = req.cookies.jwtVisitor;

        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            const description = req.body.description;

            Visitor.updateOne({ _id: decodedToken.id },{$push: { descriptions: description }}, (error) => {
                if(error) {
                    console.log(error);
                } else {
                    res.redirect('/visitor/login'); 
                }
            })
        });
    } catch (error) {
        console.log(error);
    }
}   

module.exports = {
    detect1_get, 
    detect1_post,
    detect2_get, 
    detect2_post,
    detect3_get, 
    detect3_post
}