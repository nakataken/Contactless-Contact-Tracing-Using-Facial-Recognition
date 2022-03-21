const jwt = require("jsonwebtoken");
const Visitor = require("../models/Visitor.js");
const {Canvas, Image} = require("canvas");
const canvas = require("canvas");
const faceapi = require("face-api.js");
const fs = require('fs')
faceapi.env.monkeyPatch({ Canvas, Image });

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
            const img = await canvas.loadImage(req.file.path);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            const description = detections.descriptor;

            Visitor.updateOne({_id: decodedToken.id}, {$push: {descriptions: description}}, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    fs.unlink(req.file.path, (error) => {
                        if (error) {
                            console.error(error)
                            return
                        }
                    })
                    res.redirect('/visitor/detect/2');
                }
            })
        });
    } catch(error) {
        console.log(error)
    }
}

const detect2_post = (req, res) => {
    try {
        const token = req.cookies.jwtVisitor;

        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            const img = await canvas.loadImage(req.file.path);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            const description = detections.descriptor;

            Visitor.updateOne({_id: decodedToken.id}, {$push: {descriptions: description}}, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    fs.unlink(req.file.path, (error) => {
                        if (error) {
                            console.error(error)
                            return
                        }
                    })
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
            const img = await canvas.loadImage(req.file.path);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            const description = detections.descriptor;

            Visitor.updateOne({_id: decodedToken.id}, {$push: {descriptions: description}}, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    fs.unlink(req.file.path, (error) => {
                        if (error) {
                            console.error(error)
                            return
                        }
                    })
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
        let visitors = await Visitor.find();

        if(visitors) {
            for (i = 0; i < visitors.length; i++) {
                // Change the face data descriptors from Objects to Float32Array type
                for (j = 0; j < visitors[i].descriptions.length; j++) {
                    visitors[i].descriptions[j] = new Float32Array(Object.values(visitors[i].descriptions[j]));
                }
                // Turn the DB face docs to
                visitors[i] = new faceapi.LabeledFaceDescriptors(visitors[i]._id.toString(), visitors[i].descriptions);
            }
            // Load face matcher to find the matching face
            const faceMatcher = new faceapi.FaceMatcher(visitors, 0.6);

            // Read the image using canvas or other method
            const img = await canvas.loadImage(req.file.path);
            let temp = faceapi.createCanvasFromMedia(img);

            // Process the image for the model
            const displaySize = { width: img.width, height: img.height };
            faceapi.matchDimensions(temp, displaySize);

            // Find matching faces
            const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            
            fs.unlink(req.file.path, (error) => {
                if (error) {
                    console.error(error)
                    return
                }
            })
            
            const results = resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));

            if(results) {
                const user = await Visitor.findById(results[0]._label);
                console.log(`${user.name.fname} ${user.name.mi} ${user.name.lname}`);
                // Insert log post here
            } else {
                console.log("No face matched.");
            }
        } else {
            console.log("No visitors")
        }
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
    detect3_post,
    verification_post
}