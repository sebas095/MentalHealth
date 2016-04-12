const User = require('../models/user');
const uuid = require('uuid');

exports.home = function(req, res) {
  res.render('users/calendar/index');
}
