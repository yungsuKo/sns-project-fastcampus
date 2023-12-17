const express = require('express');
const User = require('../models/users.model');
const usersRouter = express.Router();
const passport = require('passport');


usersRouter.post('/signup', async(req,res)=> {
    const user = new User(req.body);
    try{
        await user.save();
        res.redirect('/login');
    }catch(error){
        console.log(error);
    }

})

usersRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.json({ msg: info });
      }
      req.logIn(user, function (err) {
        if (err) return next(err);
        res.redirect('/posts');
      });
    })(req, res, next);
  });
  

module.exports = usersRouter;
