import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Post'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
}, {
    timestamp: true
});

export default mongoose.model("Like", LikeSchema);