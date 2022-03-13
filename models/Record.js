const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
    visitor_id: {
        type: String,
        required: true
    },
    establishment: {
        type: String, 
        required: true
    },
    date: { type: Date }
}, {
    timestamps: true
});

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;