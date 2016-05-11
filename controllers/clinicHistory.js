const User = require('../models/user');
const Calendar = require('../models/calendar');

exports.patients = function(req, res) {
  res.render('users/clinicHistory/new');
}
