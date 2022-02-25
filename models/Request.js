const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    email: { type: String },
    message: { type: String },
    business_permit : { type: String },
    valid_id : { type: String }
}, {
    timestamps: true
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;