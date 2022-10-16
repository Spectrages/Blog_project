import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    fullName: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
        unique: true,
    },
    hashPassword: {
        required: true,
        type: String,
    },
    avatarUrl: String,
    createdAt: String,
},
    {
        timestamp: true
    }
);

export default mongoose.model("User", UserSchema);