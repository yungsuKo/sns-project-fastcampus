const express = require('express');
const app = express();
const PORT = 4000;
const path = require('path');
const { default: mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/users.model');
const passport = require('passport');
const cookieEncrypyionKey = 'superscret-key';
const cookieSession = require('cookie-session');
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require('./middlewares/auth');
require('dotenv').config();

app.use(
  cookieSession({
    name: 'cookie-session-name',
    keys: [cookieEncrypyionKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb();
    };
  }

  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb();
    };
  }

  next();
});
require('./config/passport');

const commentsRouter = require('./routes/comments.router');
const friendsRouter = require('./routes/friends.router');
const likesRouter = require('./routes/likes.router');
const mainRouter = require('./routes/main.router');
const postsRouter = require('./routes/posts.router');
const profileRouter = require('./routes/profile.router');
const usersRouter = require('./routes/users.router');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/static', express.static(path.join(__dirname, 'public')));
// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

mongoose
  .connect(`${process.env.MONGO_URL}`)
  .then(() => {
    console.log('mongodb connected');
  })
  .catch((err) => {
    console.log(err);
  });

// app.get('/', checkAuthenticated, (req, res) => {
//   console.log(req.user);
//   res.render('index');
// });
// app.get('/login', checkNotAuthenticated, (req, res) => {
//   res.render('login');
// });
// app.post('/login', (req, res, next) => {
//   passport.authenticate('local', (err, user, info) => {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.json({ msg: info });
//     }
//     req.logIn(user, function (err) {
//       if (err) return next(err);
//       res.redirect('/');
//     });
//   })(req, res, next);
// });

// app.get('/auth/google', passport.authenticate('google'), () => {});
// app.get(
//   '/auth/google/callback',
//   passport.authenticate('google', {
//     successReturnToOrRedirect: '/',
//     failureRedirect: '/login',
//   })
// );

app.use('/', mainRouter);
app.use('/auth', usersRouter);
app.use('/comments', commentsRouter);
app.use('/posts', postsRouter);
app.use('/friends', friendsRouter);
app.use('/post/:id/likes', likesRouter);
app.use('/profile', profileRouter);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});