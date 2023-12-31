const express = require('express');
const { checkAuthenticated, checkIsMe } = require('../middlewares/auth');
const User = require('../models/users.model');
const Post = require('../models/posts.model');
const router = express.Router({
    mergeParams: true
});

router.get('/', checkAuthenticated, async (req, res) => {
    console.log(req.params.id);
    const posts = await Post.find({"author.id": req.params.id}).populate('comments');
    const user = await User.findById(req.params.id);
    res.render('profile', {
        user,
        posts
    })
})

router.get('/edit', checkIsMe, async(req, res) => {
    console.log(req.params.id);
    res.render('profile/edit', {
        user: req.user
    });
})

router.put('/', checkIsMe, async(req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    console.log(user);
    if(!user){
        req.flash('error', '유저가 업데이트 되지 않았습니다.');
        res.redirect(`/profile/${req.user._id}`);
    }else{
        req.flash('success', '유저가 정상적으로 업데이트 되었습니다.');
        res.redirect(`/profile/${req.user._id}`);
    }
})


module.exports = router;
