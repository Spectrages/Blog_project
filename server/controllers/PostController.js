import PostModel from '../model/post.js'

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts.map(obj => obj.tags).flat().slice(0, 5);
        res.json(tags);
    } catch (e) {
        res.status(500).json({message: "Failed to retrieve articles"});
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    } catch (e) {
        res.status(500).json({message: "Failed to retrieve articles"});
    }
};

export const getOne = (req, res) => {
    try{
        const postId = req.params.id;
        PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            },

            (err, doc) => {
                if(err) {
                    console.log(err);
                    return res.status(500).json({message: "Failed to get article"});
                }
                if(!doc) {
                    return res.status(404).json({message: "Article not found"});
                }
                res.json(doc);
            }
        ).populate('user');
    } catch (error) {
        res.status(500).json({message: "Failed to get article"});
    }
};

export const create = async (req, res) => {
    try{
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.toString().split(',') && req.body.tags.toString().split(' '),
            user: req.userId,
            createdAt: new Date().toLocaleString()
        });

        const post = await doc.save();
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to create post"})
    }
};

export const remove = (req, res) => {
    try{
        const postId = req.params.id;
        PostModel.findOneAndDelete({
            _id: postId
        }, (err, doc) => {
            if(err) {
                console.log(err);
                return res.status(500).json({message: "Failed to delete article"});
            }
            if(!doc) {
                return res.status(404).json({message: "Article not found"});
            }
            res.json({
                success: true
            });
        })

    } catch (error) {
        res.status(500).json({message: "Failed to delete article"});
    }
};

export const update = async (req, res) => {
    try{
        const postId = req.params.id;

        await PostModel.updateOne(
            {
            _id: postId
            },
            {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            tags: req.body.tags.toString().split(',') && req.body.tags.toString().split(' '),
            });
            res.json({
                success: true
            });
    } catch (error) {
        res.status(500).json({message: "Failed to update article"});
    }
};
