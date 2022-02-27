const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    establishment_name : { type: String },
    establishment_owner: { type: String },
    establishment_address: { type: String },
    email: { type: String },
    contact: { type: String },
    message: { type: String },
    business_permit : { type: String },
    valid_id : { type: String }
}, {
    timestamps: true
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;