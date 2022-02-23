import mongoose from "mongoose";

const faceSchema = new mongoose.Schema({
    visitor: [{
        type: Schema.Types.ObjectId, 
        ref: 'Visitor'
    }],
    descriptions: {
        type: Array,
        required: true
    },
}, {
    timestamps: true
});

const Face = mongoose.model("Face", faceSchema);

export default Face;
