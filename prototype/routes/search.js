const express = require('express');
const router = express.Router();
const giphyConfig = require('../configs/giphyAPI')
const api_key = giphyConfig.key
const fetch = require('node-fetch')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'GIF Finder', user: req.user});
});

/* Send a POST request to Giphy API for GIFs */
router.post('/result', function(req, res, next){
    const { keyword } = req.body;
    const api_url = `http://api.giphy.com/v1/gifs/search?q=${keyword}&api_key=${api_key}&limit=10`;
    fetch(api_url)
        .then(response => response.json())
        .then(content => {
            console.log(content.data);
            res.render('result', { title: 'Search Result', keyword: keyword, data: content.data});
        })
        .catch(err => {
            console.error(err);
        });
});

module.exports = router;
