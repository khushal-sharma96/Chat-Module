import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    isGroup: {
        type: Boolean,
        default: false
    },
    senderId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    receiverId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    userIds: {
        type: Array
    },
    groupName: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model("Channel", Schema);