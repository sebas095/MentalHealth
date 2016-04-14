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
  var eps = req.session.user.epsRelated;
  var generales = [];
  var especialistas = [];

  User.find({epsRelated: eps}, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      res.send(500, err);
    }
    for (var user in data) {
      var index1 = getIndex(data[user].rol, 'medicoGeneral');
      var index2 = getIndex(data[user].rol, 'medicoEspecialista');
      if (index1 != -1) {
        generales.push(data[user]);
      }
      if (index2 != -1) {
        especialistas.push(data[user]);
      }
    }
    res.render('users/calendar/index', {generales: generales, especialistas: especialistas});
  });
}

function getIndex(array, match) {
  for (var i in array) {
    if (array[i].name == match) return i;
  }
  return -1;
}
