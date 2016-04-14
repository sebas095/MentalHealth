const User = require('../models/user');
const uuid = require('uuid');

exports.home = function(req, res) {
  if (req.params.rol == 'paciente') {
    var user = req.query.medicos.split('-');

    User.find({
      names: user[0],
      documentNumber: user[1]
    }, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        res.send(500, err);
      }
      res.render('users/calendar/paciente', {medico: data[0]});
    });
  }
  else {
    res.render('users/calendar/medicos', {medico: req.params.rol, times: req.query.times});
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
      if (data[user].id != req.session.user.id) {
        var index1 = getIndex(data[user].rol, 'medicoGeneral');
        var index2 = getIndex(data[user].rol, 'medicoEspecialista');
        if (index1 != -1) {
          generales.push(data[user]);
        }
        if (index2 != -1) {
          especialistas.push(data[user]);
        }
      }
    }
    res.render('users/calendar/index', {generales: generales, especialistas: especialistas});
  });
}

exports.initTime = function(req, res) {
  res.render('users/calendar/initTime', {medico: req.params.rol});
}

exports.saveChanges = function(req, res) {
  console.log('body: ', req.body);
  res.redirect('/users/' + req.session.user.id + '/' + req.params.rol);
}

function getIndex(array, match) {
  for (var i in array) {
    if (array[i].name == match) return i;
  }
  return -1;
}
