const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find()
      .then(users => res.json(users))
      .catch(err => res.status(400).json('Error: ' + err));
});



module.exports = router;
