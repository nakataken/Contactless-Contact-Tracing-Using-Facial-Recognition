const mongoose = require("mongoose");

const faceSchema = new mongoose.Schema({
    visitor_id: {
        type: String,
        required:true
    },
    descriptions: {
        type: Array,
        required: true
    },
}, {
    timestamps: true
});

const Face = mongoose.model("Face", faceSchema);

module.exports = Face;
