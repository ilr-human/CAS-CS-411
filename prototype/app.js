const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const spotifyConfig = require('./configs/spotifyAPI');
const User = require('./models/userModel');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const passportRouter = require('./routes/passport');

const app = express();

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }));

const dbConfig = require('../prototype/configs/dbConfig')
const uri = dbConfig.uri
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize()); // getting weird errors on this
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('passport', passportRouter);

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});


passport.use(
    new SpotifyStrategy(
        {
          clientID: spotifyConfig.clientID,
          clientSecret: spotifyConfig.clientSecret,
          callbackURL: 'http://localhost:3000/auth/spotify/callback'
        },
        function(accessToken, refreshToken, expires_in, profile, done) {
          User.findOne({userID: profile.id})
              .then(user => console.log(user))
              .catch(err => {
                    const userID = profile.id;
                    const username = profile.name;
                    const gifs = [];
                    const newUser = new User({
                      userID,
                      username,
                      gifs
                    });
                    newUser.save()
                    //                      .catch(err => res.status(400).json("Error :" + err));
                    return done(null, profile);
                  }
              )
          return done(null, profile);
        }
    )
);

app.get('./auth', passport.authenticate('spotify'), function(req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
});
//
app.get(
    '/auth/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
