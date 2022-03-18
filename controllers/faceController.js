const jwt = require("jsonwebtoken");
const Visitor = require("../models/Visitor.js");
// const {Canvas, Image} = require("canvas");
const faceapi = require("face-api.js");
// faceapi.env.monkeyPatch({ Canvas, Image });

async function LoadModels() {
    await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");
    await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");
    await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");
}

LoadModels();

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

            Visitor.updateOne({
                _id: decodedToken.id
            }, {
                $push: {
                    descriptions: description
                }
            }, (error) => {
                if (error) {
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
    try {
        const token = req.cookies.jwtVisitor;

        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            const description = req.body.description;

            Visitor.updateOne({
                _id: decodedToken.id
            }, {
                $push: {
                    descriptions: description
                }
            }, (error) => {
                if (error) {
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
    try {
        const token = req.cookies.jwtVisitor;

        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            const description = req.body.description;

            Visitor.updateOne({
                _id: decodedToken.id
            }, {
                $push: {
                    descriptions: description
                }
            }, (error) => {
                if (error) {
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

const verification_post = async (req, res) => {
    try {
        const resizedDetections = req.body.resized;

        let visitors = await Visitor.find();

        for (i = 0; i < visitors.length; i++) {
            for (j = 0; j < visitors[i].descriptions.length; j++) {
                visitors[i].descriptions[j] = new Float32Array(Object.values(visitors[i].descriptions[j]));
            }
            visitors[i] = new faceapi.LabeledFaceDescriptors(visitors[i]._id.toString(), visitors[i].descriptions);
        }

        const faceMatcher = new faceapi.FaceMatcher(visitors, 0.6);
        const results = resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));

        console.log("Faces: ", visitors);
        console.log("Resized Detections: ", resizedDetections[0].descriptor);

        // const results = faceMatcher.findBestMatch(resizedDetections[0].descriptor);
        // console.log("Result: ", results);
        // console.log("Test ", test);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

module.exports = {
    detect1_get,
    detect1_post,
    detect2_get,
    detect2_post,
    detect3_get,
    detect3_post,
    verification_post
}