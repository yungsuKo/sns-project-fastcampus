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

module.exports = router;
