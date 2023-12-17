const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minLength: 5,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // null 값 unique 에러 방지
  },
  kakaoId:{
    type: String,
    unique: true,
    sparse: true, // null 값 unique 에러 방지
  },
  username: {
    type: String,
    default: 'username'
  },
  firstName: {
    type: String,
    default: 'firstName'
  },
  lastName: {
    type: String,
    default: 'lastName'
  },
  bio: {
    type: String,
    default: 'bio'
  },
  hometown: {
    type: String,
    default: 'hometown'
  },
  workplace: {
    type: String,
    default: 'workplace'
  },
  education: {
    type: String,
    default: 'education'
  },
  contact: {
    type: Number,
    default: 1012345678,
  },
  friends:[{type: String}],
  friendsRequests: [{type: String}]
}, {timestamp: true});

const rounds = 5;
userSchema.pre('save', function (next) {
  let user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(rounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
  // if (plainPassword === this.password) {
  //   cb(null, true);
  // } else {
  //   cb(null, false);
  // }
  // return cb({ error: 'error' });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
