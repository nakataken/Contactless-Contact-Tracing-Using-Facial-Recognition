import mongoose from "mongoose";

// Validate entries on controller and frontend
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
    password: { type: String }
})

const Visitor = mongoose.model("Visitor", visitorSchema);

export default Visitor;