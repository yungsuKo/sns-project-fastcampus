const express = require('express');
const { checkAuthenticated } = require('../middlewares/auth');
const User = require('../models/users.model');
const router = express.Router();

router.get('/', checkAuthenticated, async (req, res, next) => {
    const users = await User.find();
    if(!users){
        req.flash('error', '유저가 없습니다.');
        res.redirect('back');
    }else{
        res.render('friends/index', {
            users
        })
    }
})

router.put('/:id/add-friend', checkAuthenticated, async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        req.flash('error', '유저를 찾는데 에러가 발생했습니다.');
        res.redirect('back');
    }else{
        const updatedUser = await User.findByIdAndUpdate(user._id, {
            friendsRequests: user.friendsRequests.concat([req.user._id]),
        })
        if(!updatedUser){
            req.flash('error', '친구 요청에 실패했습니다.');
            res.redirect('back');
        }else{
            req.flash('success', '친구 요청에 성공했습니다.');
            res.redirect('back');
        }
    }
})

router.put('/:id/remove-friend-request', checkAuthenticated, async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        req.flash('error', '인증되지 않은 유저입니다.');
        res.redirect('back');
    }else{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            friendsRequests: user.friendsRequests.filter((request) => request !== req.user._id.toString())
        })
        if(!updatedUser){
            req.flash('error', '친구 요청 취소에 실패했습니다.');
            res.redirect('back');
        }else{
            req.flash('success', '친구 요청 취소에 성공했습니다.');
            res.redirect('back');
        }
    }
})

module.exports = router;
