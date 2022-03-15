const Face = require("../models/Face.js");
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
        const description = req.body.description;

        const face = new Face({
            visitor_id: "testID",
            descriptions: [description],
        });

        await face.save((error) => {
            if(error) {
                console.log(error)
            } else {
                res.redirect('/visitor/detect/2'); 
            }
        });
    } catch (error) {
        console.log(error);
    }
}   

const detect2_post = (req, res) => {
    try{
        const description = req.body.description;

        Face.updateOne({ visitor_id: "testID" },{$push: { descriptions: description }}, (error) => {
            if(error) {
                console.log(error);
            } else {
                res.redirect('/visitor/detect/3'); 
            }
        })
    } catch (error) {
        console.log(error);
    }
}   

const detect3_post = (req, res) => {
    try{
        const description = req.body.description;

        Face.updateOne({ visitor_id: "testID" },{$push: { descriptions: description }}, (error) => {
            if(error) {
                console.log(error);
            } else {
                res.redirect('/visitor/login'); 
            }
        })
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