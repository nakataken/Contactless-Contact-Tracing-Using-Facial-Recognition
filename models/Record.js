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
    date: { type: date },
    temperature : { type: number },
}, {
    timestamps: true
});

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;