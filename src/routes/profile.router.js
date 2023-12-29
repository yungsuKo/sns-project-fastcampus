const express = require('express');
const { checkAuthenticated } = require('../middlewares/auth');
const User = require('../models/users.model');
const Post = require('../models/posts.model');
const router = express.Router({
    mergeParams: true
});

router.get('/', checkAuthenticated, async (req, res) => {
    console.log(req.params.id);
    const posts = await Post.find({"author.id": req.params.id}).populate('comments');
    console.log(posts)
    res.render('profile/index', {
        user: posts
    })
})

module.exports = router;
