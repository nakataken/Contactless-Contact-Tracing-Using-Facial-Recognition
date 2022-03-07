const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
    // visitor: [{
    //     type: Schema.Types.ObjectId, 
    //     ref: 'Visitor'
    // }],
    // establishment: [{
    //     type: Schema.Types.ObjectId, 
    //     ref: 'Establishment'
    // }],
    date: { type: date }
}, {
    timestamps: true
});

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;