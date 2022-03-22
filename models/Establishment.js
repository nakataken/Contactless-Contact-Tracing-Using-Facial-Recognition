const mongoose = require("mongoose");

const establishmentSchema = new mongoose.Schema({
    name : { type: String },
    owner: { type: String },
    address : { type: String },
    email: { type: String }, 
    contact: { type: String },
    password: { type: String }
}, {
    timestamps: true
});

const Establishment = mongoose.model("Establishment", establishmentSchema);

module.exports = Establishment;