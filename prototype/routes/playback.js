const express = require('express');
const router = express.Router();

router.post('/', function(req, res, next) {
    res.setHeader(req.access_token);
    const api_url = 'https://api.spotify.com/v1/me/player/currently-playing';
    fetch(api_url)
        .then(response => response.json())
        .then(content => {
            console.log(content.data);
            res.render('playbackResult', {data: content.data});
            })
        .catch(err => {
            console.error(err);
        });
});

module.exports = router;
