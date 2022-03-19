const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    name : { type: String },
    owner: { type: String },
    address: { type: String },
    email: { type: String },
    contact: { type: String },
    message: { type: String },
    permit : { type: String },
    validID : { type: String }
}, {
    timestamps: true
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;