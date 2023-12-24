const express = require('express');
const app = express();
const PORT = 4000;
const path = require('path');
const flash = require('connect-flash');
const { default: mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/users.model');
const methodOverride = require('method-override');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('dotenv').config();

app.use(
  cookieSession({
    name: 'cookie-session-name',
    keys: [process.env.COOKIE_KEY],
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

app.use(express.static(path.join(__dirname, 'public')));
// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());

mongoose
  .connect(`${process.env.MONGO_URL}`)
  .then(() => {
    console.log('mongodb connected');
  })
  .catch((err) => {
    console.log(err);
  });

app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.currentUser = req.user,
  next();
})

app.get('/send', (req, res) => {
  req.flash('post success', '포스트가 생성되었습니다.');
  res.redirect('/receive');
});

app.get('/receive', (req, res) => {
  res.send(req.flash('post success')[0]);
});

app.use('/', mainRouter);
app.use('/auth', usersRouter);
app.use('/posts/:id/comments', commentsRouter);
app.use('/posts', postsRouter);
app.use('/friends', friendsRouter);
app.use('/post/:id/likes', likesRouter);
app.use('/profile', profileRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message || "Error Occured");
})



app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
