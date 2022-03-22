const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
    visitor_id: {
        type: String,
        required: true
    },
    establishment_id: {
        type: String, 
        required: true
    }
}, { 
    timestamps: true
    // expireAfterSeconds: 60
});

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;