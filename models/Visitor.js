const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
    fname : { type: String },
    mi: { type: String },
    lname : { type: String },
    bdate: { type: Date }, 
    barangay: { type: String },
    city: { type: String },
    province: { type: String },
    contact: { type: String },
    email: { type: String },
    password: { type: String },
    usertype: {
        type: String,
        default: "visitor"
    }
}, {
    timestamps: true
});

const Visitor = mongoose.model("Visitor", visitorSchema);

module.exports = Visitor;