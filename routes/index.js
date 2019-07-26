var express = require('express');
var router = express.Router();
var validator = require('validator');
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userMiddleware = require('../middlewares/users');
var multer = require('multer');
var upload = multer({})
var request = require('request-promise');
var Post = require('../models/post');

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

/* GET home page. */
router.get('/', userMiddleware.isLogout, function (req, res, next) {
  res.render('index');
});

router.get('/register', userMiddleware.isLogout, (req, res, next) => {
  res.render('register');
});

router.post('/register', async (req, res, next) => {
  let check = validateRegister(req.body);

  if (check !== true) {
    req.flash("error", check);
    res.redirect('/register');
  }
  else {
    let user = new User({
      username: req.body.username,
      password: req.body.password
    });

    await user.save();
    console.log(user);
    res.redirect('/');
  }

  console.log(req.body);
});

router.post('/login', passport.authenticate("local"),
  async (req, res, next) => {
    let {
      username,
      password
    } = req.body;

    let user = await User.findOne({
      username,
      password
    });

    if (user) {
      // Login successfully!
      req.flash("success", "Đăng nhập thành công")
      res.redirect('/home');
    }
    else {
      // Login failed!
      req.flash("error", "Tài đăng nhập hoặc mật khẩu không hợp lệ")
      res.redirect('/');
    }

  });

router.get('/home', userMiddleware.isLogged, async (req, res, next) => {
  let posts = await Post.find({});
  res.locals.posts = posts;
  res.render("home");
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.get('/post', userMiddleware.isLogged, (req, res, next) => {
  res.render('post');
});

router.post('/post', upload.single('image'), async (req, res, next) => {
  let result = await request({
    uri: 'https://api.imgur.com/3/image',
    method: 'POST',
    formData: {
      "image": req.file.buffer
    },
    json: true,
    headers: {
      "Authorization": "Client-ID a3bba80cf4cb9e9"
    }
  })

  if (result.success) {
    let post = new Post({
      thumb: result.data.link,
      title: req.body.title,
      content: req.body.content
    })
    await post.save();
    res.redirect('/home');
  }
  else {
    req.flash("error", "Đã có lỗi xảy ra");
    res.redirect("/post");
  }

});

function validateRegister(body) {
  let arr = [];

  if (!validator.equals(body.password, body.repassword))
    arr.push('Mật khẩu không giống nhau');
  if (!validator.isAlphanumeric(body.username))
    arr.push('Tên đăng nhập chỉ phép các kí tự thông thường và chữ số');
  if (!validator.isLowercase(body.username))
    arr.push('Tên đăng nhập chỉ được viết thường');


  if (arr.length === 0) return true;
  else return arr;
}

module.exports = router;
