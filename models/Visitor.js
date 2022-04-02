const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
    name: { type:Object },
    bdate: { type: String }, 
    address: { type: Object },
    email: { type: String },
    contact: {type: String},
    password: { type: String },
    vaccine_card: { 
        type: String,
        default: null
    },
    isVaccinated: { 
        type: Boolean,
        default: false
    },
    descriptions: {
        type: Array,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Visitor = mongoose.model("Visitor", visitorSchema);

module.exports = Visitor;