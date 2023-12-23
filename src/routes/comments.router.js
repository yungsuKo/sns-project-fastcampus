const express = require('express');
const { checkAuthenticated } = require('../middlewares/auth');
const Post = require('../models/posts.model');
const Comment = require('../models/comments.model')
const router = express.Router({
    mergeParams: true
});

router.post('/', checkAuthenticated,async (req, res) => {
    console.log(req.params)
    const post = await Post.findById(req.params.id);
    if(!post){
        console.log('error ocurred')
        req.flash('error', '댓글을 생성중 포스트를 찾지 못했습니다.');
        res.redirect('back');
    }else{
        const comment = await Comment.create({
            ...req.body,
            post: req.params.id,
            author:{
                id: req.user._id,
                username: req.user.username
            }
        });
        if(!comment){
            req.flash('error', '댓글을 생성에 실패했습니다.');
            res.redirect('back');
        }else{
            console.log(comment);
            console.log(post);
            // post에 comment 데이터 넣어주기
            post.comments.push(comment);
            post.save();
            req.flash('success', '댓글을 생성에 성공했습니다.');
            res.redirect('back')
        }
    }
})

module.exports = router;
