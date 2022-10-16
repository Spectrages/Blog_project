import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    },
    text: {
        required: true,
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: String
}, {
    timestamp: true
});

export default mongoose.model("Comment", CommentSchema);