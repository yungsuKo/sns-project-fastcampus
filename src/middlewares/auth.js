const Post = require('../models/posts.model');

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

async function checkPostOwnership(req, res, next) {
  if(req.isAuthenticated()){
    const post = await Post.findById(req.params.id);
    if(!post){
      req.flash('error', '포스트가 없거나 에러가 발생했습니다.');
      res.redirect('back');
    }else{
      if(post.author.id.equals(req.user._id)){
        req.post = post;
        next();
      }else{
        req.flash('error', '권한이 없는 포스트 입니다.');
        res.redirect('back');
      }
    }
  }else{
    req.flash('error', '로그인을 먼저 해주세요');
    res.redirect('/login')
  }
}

module.exports = { checkAuthenticated, checkNotAuthenticated, checkPostOwnership };
