var express = require('express');
var router = express.Router();
var giphyConfig = require('../configs/giphyAPI')
const api_key = giphyConfig.key

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GIF Finder'});
});

/* Send a POST request to Giphy API for GIFs */
router.post('/searchGIF', function(req, res, next){
  const { keyword } = req.body;
  // const api_url = `http://api.giphy.com/v1/gifs/search?q=${keyword}&api_key=${api_key}&limit=1`;
  res.render('result', { title: 'Search Result', key: api_key, keyword: keyword });
});
module.exports = router;
