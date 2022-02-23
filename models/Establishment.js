import mongoose from "mongoose";

const establishmentSchema = new mongoose.Schema({
    establishment_name : { type: String },
    establishment_owner: { type: String },
    establishment_address : { type: String },
    email: { type: String }, 
    contact: { type: String },
    password: { type: String }
}, {
    timestamps: true
});

const Establishment = mongoose.model("Establishment", establishmentSchema);

export default Establishment;