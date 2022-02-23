import mongoose from "mongoose";

const administratorSchema = new mongoose.Schema({
    email : { type: String },
    password: { type: String },
    admin_type : { type: String }
}, {
    timestamps: true
});

const Administrator = mongoose.model("Administrator", administratorSchema);

export default Administrator;