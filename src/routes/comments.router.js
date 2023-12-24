const express = require('express');
const { checkAuthenticated, checkCommnetOwnership } = require('../middlewares/auth');
const Post = require('../models/posts.model');
const Comment = require('../models/comments.model');
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

router.delete('/:commentId', checkCommnetOwnership , async (req, res, next) => {
    console.log(req.params.commentId)
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    console.log(comment)
    if(!comment){
        req.flash('error', '삭제에 실패했습니다.');
        res.redirect('back');
    }else{
        req.flash('success', '삭제에 성공했습니다.');
        res.redirect('back');
    }
})

router.get('/:commentId/edit', checkCommnetOwnership, async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if(!post){
        req.flash('error', '없는 포스트입니다');
        res.redirect('back');
    }else{
        res.render('comments/edit', {
            post,
            comment: req.comment
        });
    }
})

router.put('/:commentId/edit', checkCommnetOwnership, async(req, res, next) => {
    console.log(req.body);
    const comment = await Comment.findByIdAndUpdate(req.comment._id, req.body);
    if(!comment){
        req.flash('error', '에러가 발생하였습니다.');
        res.redirect('back');
    }else{
        req.flash('success', '댓글을 수정하였습니다.');
        res.redirect('/posts');
    }

})

module.exports = router;
