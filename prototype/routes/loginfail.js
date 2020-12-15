const app = require("../app");
const express = require('express');
const router = express.Router();
const loginfail = require('passport')


// code from https://codeburst.io/authenticate-your-app-with-spotify-oauth-25744e906ade
router.get('/', function(req,res,next){
    res.render('loginfail')
})


module.exports = router;
