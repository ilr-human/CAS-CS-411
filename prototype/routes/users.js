const express = require('express');
const router = express.Router();
let User = require('../models/userModel')

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find()
      .then(users => res.json(users))
      .catch(err => res.status(400).json('Error: ' + err));
});

/*
---include this in Spotify oauth log in---
get user data from Spotify oauth and pass into:
const userID = Spotify user id
const username = Spotify username
const newUser = new User({
  userID,
  username
});
newUser.save()
.catch(err => res.status(400).json("Error :" + err));
 */

// get a certain user from db
router.get('/:id', function(req, res, next){
  User.findOne({userID:req.params.id})
      .then(user => res.json(user))
      .catch(err => res.status(400).json('Error: ' + err));
});

// update an user
router.post('/:id', function(req, res, next){
  User.findOne({userID:req.params.id})
      .then(user => {
        // update fields here (using push to add to array)
        user.save()
            .then(() => res.json("Updated!"))
            .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
