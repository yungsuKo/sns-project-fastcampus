const express = require('express');
const { checkAuthenticated } = require('../middlewares/auth');
const postsRouter = express.Router();

postsRouter.get('/', checkAuthenticated, (req, res) => {
    res.render('posts/index')
})

module.exports = postsRouter;
