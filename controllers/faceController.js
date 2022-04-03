const jwt = require("jsonwebtoken");
const Visitor = require("../models/Visitor.js");
const Record = require("../models/Record.js");
const {Canvas, Image} = require("canvas");
const canvas = require("canvas");
const faceapi = require("face-api.js");
const fs = require('fs');
const Establishment = require("../models/Establishment.js");
faceapi.env.monkeyPatch({ Canvas, Image });

async function LoadModels() {
    await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");
    await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");
    await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");
}

LoadModels();

const detect_get = (req, res) => {
    res.render('./Visitor Module/detect', {process: req.params.process});
}

const detect_post = async (req, res) => {
    try {
        const token = req.cookies.jwtVisitor;
        let processFace = req.params.process;

        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            const img = await canvas.loadImage(req.file.path);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            const description = await detections.descriptor;

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
                    processFace++;
                    if(processFace < 6)
                        res.redirect(`/visitor/detect/${processFace}`);
                    else 
                        res.redirect('/visitor/login');
                }   
            })
        });
    } catch(error) {
        console.log(error)
    }
}

// const check_get = (req, res) => {
//     res.render('./Visitor Module/check');
// }

// const check_post = async (req, res) => {
//     try {
//         const token = req.cookies.jwtVisitor;

//         jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
//             let visitors = await Visitor.find();

//             if(visitors) {
//                 for (i = 0; i < visitors.length; i++) {
//                     // Change the face data descriptors from Objects to Float32Array type
//                     for (j = 0; j < visitors[i].descriptions.length; j++) {
//                         visitors[i].descriptions[j] = new Float32Array(Object.values(visitors[i].descriptions[j]));
//                     }
//                     // Turn the DB face docs to
//                     visitors[i] = new faceapi.LabeledFaceDescriptors(visitors[i]._id.toString(), visitors[i].descriptions);
//                 }
//                 // Load face matcher to find the matching face
//                 const faceMatcher = new faceapi.FaceMatcher(visitors, 0.9);

//                 // Read the image using canvas or other method
//                 const img = await canvas.loadImage(req.file.path);
//                 let temp = faceapi.createCanvasFromMedia(img);

//                 // Process the image for the model
//                 const displaySize = { width: img.width, height: img.height };
//                 faceapi.matchDimensions(temp, displaySize);

//                 // Find matching faces
//                 const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
//                 const resizedDetections = await faceapi.resizeResults(detections, displaySize);

//                 fs.unlink(req.file.path, (error) => {
//                     if (error) {
//                         console.error(error)
//                         return
//                     }
//                 })
                
//                 // const results = await resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));
//                 const results = await resizedDetections.map((d) => {
//                     return faceMatcher.matchDescriptor(d.descriptor)
//                 });
//                 // res.json({success:true});
//                 if(!results[0]) {
//                     console.log("No same face detected.")
//                     console.log(results);
//                     res.json({success:true})
//                 } else {
//                     console.log("Same face detected.")
//                     console.log(results);
//                     // await Visitor.deleteOne({ _id: decodedToken.id });
//                     res.json({success:false});
//                 }
//             }
//         });
//     } catch(error) {
//         console.log(error);
//     }
// }

const verification_get = (req, res) => {
    res.render('./Establishment Module/verify');
}

const verification_post = async (req, res) => {
    try {
        const token = req.cookies.jwtEstablishment;

        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
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
                const faceMatcher = new faceapi.FaceMatcher(visitors, 0.90);

                // Read the image using canvas or other method
                const img = await canvas.loadImage(req.file.path);
                let temp = faceapi.createCanvasFromMedia(img);

                // Process the image for the model
                const displaySize = { width: img.width, height: img.height };
                faceapi.matchDimensions(temp, displaySize);

                // Find matching faces
                const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
                const resizedDetections = await faceapi.resizeResults(detections, displaySize);

                
                fs.unlink(req.file.path, (error) => {
                    if (error) {
                        console.error(error)
                        return
                    }
                })
                
                const results = await resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));

                if(results) {
                    try {
                        const establishment = await Establishment.findById(decodedToken.id);
                        const visitor = await Visitor.findById(results[0]._label);
                        const record = new Record({visitor_id: results[0]._label, establishment_id: decodedToken.id});
                        
                        if(establishment.limitVaccinated) {
                            if(!visitor.isVaccinated) res.json({success:false, message: "You are not vaccinated."});
                            record.save((error, data) => {
                                if(error) return;  
                                res.json({success:true, message:`${visitor.name.fname} ${visitor.name.lname}`});
                            }) 
                        } else {
                            record.save((error, data) => {
                                if(error) return;  
                                res.json({success:true, message:`${visitor.name.fname} ${visitor.name.lname}`});
                            }) 
                        } 
                    } catch (error) {
                        console.log(error.message);
                        res.json({success:false, message: "System Error!"});
                    }
                } else {
                    console.log("No face matched.");
                    res.json({success:false, message: "No face matched!"});
                }
            } else {
                console.log("No visitors")
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(401).json(error.message);
    }
}

module.exports = {
    detect_get,
    detect_post,
    verification_get,
    verification_post,
    // check_get,
    // check_post
}