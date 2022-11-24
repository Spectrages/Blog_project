import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
        title: {
            required: true,
            type: String,
        },
        text: {
            required: true,
            type: String,
            unique: true,
        },
        tags: {
            type: Array,
            default: [],
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        postLikes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like',
        }],
        imageUrl: String,
        createdAt: String,
    },
    {
        timestamp: true
    }
);

export default mongoose.model("Post", PostSchema);