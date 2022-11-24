import express from 'express';
import multer from 'multer';
import cors from "cors"

import mongoose from 'mongoose';
import fs from 'fs'
import { registerValidation, loginValidation } from "./validations/auth.js";
import { UserController, PostController, CommentController } from './controllers/index.js'
import { postCreateValidation } from "./validations/post.js";
import { checkAuth, handleValidationErrors }  from './utils/index.js'
import { commentCreateValidation } from "./validations/comment.js";

const PORT = process.env.PORT || 5000;
const MONGODB = process.env.MONGODB_URI || "mongodb+srv://spectrages:Spectrages15011997@cluster0.orfyg2s.mongodb.net/?retryWrites=true&w=majority";

mongoose
    .connect(MONGODB)
    .then(() => console.log('DB ok'))
    .catch((error) => console.log(`DB connect error: ${error}`));

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
}));
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (_, __, callback) => {
        if(!fs.existsSync('uploads')){
            fs.mkdirSync('uploads')
        }
        callback(null, 'uploads');
    },
    filename: (_, file, callback) => {
        callback(null, file.originalname);
    },
});

const upload = multer({storage});

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/tags', PostController.getLastTags);
app.get('posts/tags', PostController.getLastTags);

app.post('/posts/:id/add-comment', checkAuth, commentCreateValidation, CommentController.createComment);
app.get('/posts/:id/get-comment', CommentController.getAllComments);
//app.delete('posts/delete-comment/:id', checkAuth, CommentController.removeComment);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);
app.post('/posts/:id/toggle-like', checkAuth, PostController.toggle_like);


const start = () => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
};

start();