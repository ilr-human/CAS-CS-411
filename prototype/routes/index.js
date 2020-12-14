const express = require('express');
const router = express.Router();
const giphyConfig = require('../configs/giphyAPI')
const api_key = giphyConfig.key
const fetch = require('node-fetch')
// const cookieSession = require('cookie-session')
const passport = require('passport');
// const app = require("../app");
const auth = require('./passport')
// const http = require('http');
// const connect = require('connect');
const app = express()
const bodyParser = require("body-parser")


//code in progress from https://codeburst.io/authenticate-your-app-with-spotify-oauth-25744e906ade
// app.use(cookieSession({
//   name: 'spotify-auth-session',
//   keys: ['key1', 'key2']
// }))

app.use(passport.initialize()); // getting weird errors on this
app.use(passport.session());

//
//
// THESE FUNCTIONS ARE CAUSING ERRORS:
// app.get('/auth/error', (req, res) => res.send('Unknown Error'))
//
// app.get('/auth/spotify',passport.authenticate('spotify'));
//
// app.get('/auth/spotify/callback',passport.authenticate('spotify', { failureRedirect: '/auth/error' }),
//     function(req, res) {
//       res.redirect('/');
//     });
//
// app.listen(3000,()=>{
//   console.log('Serve is up and running at the port 8000')
// })

// app.get(
//     '/auth/spotify',
//     passport.authenticate('spotify', {
//         scope: ['user-read-email', 'user-read-private'],
//         showDialog: true
//     }),
//     function(req, res) {
//         // The request will be redirected to spotify for authentication, so this
//         // function will not be called.
//     }
// );

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GIF Finder'});
});

/* Send a POST request to Giphy API for GIFs */
router.post('/add', function(req,res,next){
    const userID = req.body.userID;
    const username = req.body.username;
    const url = req.body.url;
    const title = req.body.title;
    const newUser = new User({
        userID: userID,
        username: username,
        gifs: [{url: url, title: title}]
    });
    newUser.save()
        .then(() => res.json("Success"))
        .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
