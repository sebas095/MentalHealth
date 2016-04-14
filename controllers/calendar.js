const User = require('../models/user');
const uuid = require('uuid');

exports.home = function(req, res) {
  if (req.params.rol == 'paciente') {
    res.render('users/calendar/paciente');
  }
  else {
    res.render('users/calendar/medicos');
  }
}

exports.pending = function(req, res) {
  res.render('users/calendar/index');
}
