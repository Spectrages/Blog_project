import CommentModel from "../model/comment.js";

export const createComment = async (req, res) => {
    const postId = req.params.id;
    try {
        const doc = new CommentModel({
            post: postId,
            text: req.body.text,
            user: req.userId,
            createdAt: new Date().toLocaleString()
        });
        const comment = await doc.save();
        res.json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to create post"})
    }
};

export const getAllComments = async (req, res) => {
    try {
        const postId = req.params.id;
        CommentModel.find({
            post: postId
        }, (err, doc) => {
            if (err) {
                console.log(err);
                return res.status(500).json({message: "Error getting comments"});
            }
            if (!doc) {
                return res.status(404).json({message: "Comments not found"});
            }
            res.json(doc)
        }).populate('user');

    } catch (error) {
        res.status(500).json({message: "Failed to get comments"});
    }
};

export const removeComment = async (req, res) => {
    try{
        const commentId = req.params.comment;
        CommentModel.findOneAndDelete({
            _id: commentId
        }, (err, doc) => {
            if(err) {
                return res.status(500).json({message: "Failed to delete comment"});
            }
            if(!doc) {
                return res.status(404).json({message: "Comment not found"});
            }
            res.json({
                success: true
            });
        })
    } catch (error) {
        res.status(500).json({message: "Failed to delete comment"});
    }
};