const express = require('express');
const router = express.Router();
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require('../middlewares/auth');
const passport = require('passport');

router.get('/', checkAuthenticated, (req, res) => {
  console.log(req.user);
  res.render('index');
});
router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('auth/login');
});
router.get('/signup', checkNotAuthenticated, (req, res) => {
  res.render('auth/signup');
});
// --------------------
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({ msg: info });
    }
    req.logIn(user, function (err) {
      if (err) return next(err);
      res.redirect('/');
    });
  })(req, res, next);
});

router.get('/auth/google', passport.authenticate('google'), () => {});
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
  })
);

module.exports = router;
