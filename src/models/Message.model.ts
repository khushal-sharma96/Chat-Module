import { timeStamp } from "console";
import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    channelId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Channel"
    },
    body: String,
    replyId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    isEdited: Boolean,
    isDocument: Boolean,
    links: Array,
    isLink: Boolean,
    seenBy: Array,
    sentby: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    deletedAt: timeStamp
}, {
    timestamps: true
});

export default mongoose.model("Message", Schema);