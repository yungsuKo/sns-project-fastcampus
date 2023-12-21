const express = require('express');
const { checkAuthenticated, checkPostOwnership } = require('../middlewares/auth');
const postsRouter = express.Router();
const Post = require('../models/posts.model');
const Comment = require('../models/comments.model');
const multer = require('multer');
const path = require('path');

const storageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/assets/images'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({storage: storageEngine}).single('image');

postsRouter.post('/', checkAuthenticated, upload, async (req, res, next) => {
    let {desc} = req.body;
    let image = req.file? req.file.filename: "";
    // console.log('req.file', req.file);
    // console.log('req.file.filename', req.file.filename);

    const post = await Post.create({
        description: desc,
        images: image,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    })
    
    if(!post){
        req.flash('error', '포스트 생성 실패');
        res.redirect("back");
    }else{
        req.flash('success', '포스트 생성 성공');
        res.redirect("back");
    }
    

})

postsRouter.get('/', checkAuthenticated, async(req, res) => {
    const posts = await Post.find().populate('comments').sort({createdAt: -1})
    res.render('posts/index', {
        posts: posts,
        
    })
})

postsRouter.get('/:id/edit', checkPostOwnership, async (req, res, next)=> {
    console.log(req.post.description)
    res.render('posts/edit', {
        post: req.post,
    })
})

postsRouter.put('/:id/edit', checkPostOwnership, async (req, res, next)=> {
    console.log(req.body.description);
    const post = await Post.findByIdAndUpdate(req.params.id, req.body);
    console.log(post);
    if(!post){
        req.flash('error', '수정되지 않았습니다.')
        res.redirect('/posts')
    }else{
        req.flash('success', '수정이 정상적으로 되었습니다.')
        res.redirect('/posts');
    }
})

module.exports = postsRouter;
