const app = require("../app");
const express = require('express');
const router = express.Router();
const passport = require('passport')
const SpotifyStrategy = require('passport-spotify').Strategy;
const spotifyConfig = require('../configs/spotifyAPI');
const User = require('../models/userModel')

// code from https://codeburst.io/authenticate-your-app-with-spotify-oauth-25744e906ade

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
            // DB implementation steps should go here: find/create user
                return done(null, profile);

        }
    )
);

// app.get('./auth', passport.authenticate('spotify'), function(req, res) {
//     // The request will be redirected to spotify for authentication, so this
//     // function will not be called.
// });

// app.get(
//     '/auth/spotify/callback',
//     passport.authenticate('spotify', { failureRedirect: '/login' }),
//     function(req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/');
//     }
// );

module.exports = router;
