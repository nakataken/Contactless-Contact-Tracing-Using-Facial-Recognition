const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
    name: { type:Object },
    bdate: { type: String }, 
    address: { type: Object },
    email: { type: String },
    contact: {type: String},
    password: { type: String },
    descriptions: {
        type: Array,
        required: true
    },
    usertype: {
        type: String,
        default: "visitor"
    }
}, {
    timestamps: true
});

const Visitor = mongoose.model("Visitor", visitorSchema);

module.exports = Visitor;