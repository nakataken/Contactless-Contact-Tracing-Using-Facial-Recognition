const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
    visitor_id: {
        type: String,
        required: true
    },
    establishment_id: {
        type: String, 
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '30d' },
    }
}, { 
    timestamps: true
});

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;