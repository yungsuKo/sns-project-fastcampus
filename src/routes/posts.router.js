const express = require('express');
const { checkAuthenticated } = require('../middlewares/auth');
const postsRouter = express.Router();
const Post = require('../models/posts.model');
const Comment = require('../models/comments.model');

postsRouter.get('/', checkAuthenticated, async(req, res) => {
    const posts = await Post.find().populate('comments').sort({createdAt: -1})
    res.render('posts/index', {
        posts: posts,
        currentUser: req.user
    })
})

module.exports = postsRouter;
