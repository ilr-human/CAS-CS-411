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
const cookieSession = require('cookie-session')
const querystring = require('querystring');

// const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const SearchRouter = require('./routes/search')
const loginfailRouter = require('./routes/loginfail');
const playbackRouter = require('./routes/playback');

const app = express();

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }));

const stateKey = 'spotify_auth_state';

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

app.use(cookieSession({
    name: 'spotify-auth-session',
    keys: ['key1', 'key2']
}))
app.use(passport.initialize());
app.use(passport.session());

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/search', SearchRouter);
app.use('/loginfail', loginfailRouter)
app.use('/playback', playbackRouter)



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
            console.log(profile)
            User.findOne({userID:profile.id}).then(user => {
                // if user is already in DB
                if(user){
                    console.log("Current user: " + user);
                    // if user is not in DB, add to DB
                }else{
                    const userID = profile.id;
                    const username = profile.displayName;
                    const newUser = new User({
                        userID: userID,
                        username: username,
                        url: "",
                        title: "",
                    });
                    newUser.save()
                        .then(user => console.log("New user created: " + user))
                        .catch(err => console.log("Error: " + err));
                }
            })
            return done(null, profile);
        }
    )
);

app.get("/", function (req, res) {
    const user = req.user
    if(user){
        res.redirect('/search')
    }
    res.render("login");
});

app.get("/account", ensureAuthenticated, function (req, res) {
    res.render("account", { title: 'Spotify GIF Generator', user: req.user });
});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

app.get('/auth', passport.authenticate('spotify', {
    scope: ['user-read-playback-state', 'user-read-currently-playing'],
    showDialog: true,
}), function(req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
});
//
app.get(
    '/auth/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/loginfail' }),
    function(req, res) {
        var code = req.query.code || null;
        var state = req.query.state || null;
        var storedState = req.cookies ? req.cookies[stateKey] : null;

        if (state === null || state !== storedState) {
            res.redirect('/#' +
                querystring.stringify({
                    error: 'state_mismatch'
                }));
        } else {
            res.clearCookie(stateKey);
            var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                    code: code,
                    redirect_uri: redirect_uri,
                    grant_type: 'authorization_code'
                },
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                },
                json: true
            };

            request.post(authOptions, function(error, response, body) {
                if (!error && response.statusCode === 200) {

                    var access_token = body.access_token,
                        refresh_token = body.refresh_token;

                    var options = {
                        url: 'https://api.spotify.com/v1/me',
                        headers: { 'Authorization': 'Bearer ' + access_token },
                        json: true
                    };

                    // use the access token to access the Spotify Web API
                    request.get(options, function(error, response, body) {
                        console.log(body);
                    });

                    // we can also pass the token to the browser to make requests from there
                    res.redirect('/playback' +
                        querystring.stringify({
                            access_token: access_token,
                            refresh_token: refresh_token
                        }));
                } else {
                    res.redirect('/index' +
                        querystring.stringify({
                            error: 'invalid_token'
                        }));
                }
            });
        }

        res.redirect('/search');
    }
);

app.get('/refresh_token', function(req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});

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

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
};

module.exports = app;
