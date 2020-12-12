const app = require("../app");
const express = require('express');
const router = express.Router();
const passport = require('passport')
const SpotifyStrategy = require('passport-spotify').Strategy;
const spotifyConfig = require('../configs/spotifyAPI');

passport.use(
    new SpotifyStrategy(
        {
            clientID: spotifyConfig.clientID,
            clientSecret: spotifyConfig.clientSecret,
            callbackURL: 'http://localhost:8888/auth/spotify/callback'
        },
        function(accessToken, refreshToken, expires_in, profile, done) {
            User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
                return done(err, user);
            });
        }
    )
);

app.get('./oauthSpotify', passport.authenticate('spotify'), function(req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
});

app.get(
    '/auth/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);

module.exports = router;
