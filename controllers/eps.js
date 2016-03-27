const Eps = require('../models/eps');
const User = require('../models/user');
const uuid = require('uuid');

exports.create = function(req, res) {
  Eps.create({
    id: uuid.v4(),
    documentNumber: req.body.nit,
    names: req.body.nameEps,
    email: req.body.mailEps,
    epsPhone: req.body.phoneEps,
    address: req.body.addressEps,
    rol: {'name': 'eps', 'photo': null},
    accept: false,
    password: req.body.pwd,
    documentType: req.body.typeDocument,
    documentNumberPerson: req.body.numDocument,
    namesPerson: req.body.names,
    lastnames: req.body.lastnames,
    gender: req.body.gender,
    phone: req.body.phone,
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    res.redirect('/');
  });
}

exports.allowUsers = function(req, res) {
  var user = undefined;
  User.find({
    documentNumber: req.body.numDocument,
    names: req.body.names,
    lastnames: req.body.lastnames,
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    else {
      user = data[0];

      if (req.body.rechazarpaciente) {
        user = deleteRoles(user, 'paciente');
      }
      if (req.body.rechazarmedicoGeneral) {
        user = deleteRoles(user, 'medicoGeneral');
      }
      if (req.body.rechazarmedicoEspecialista) {
        user = deleteRoles(user, 'medicoEspecialista');
      }

      if (user.rol.length == 0) {
        User.destroy(user.id, function(err, data) {
          if (err) {
            console.log('Error: ', err);
            return res.send(500, err);
          }
          res.redirect('/users/' + req.session.user.id + '/' + req.session.user.rol.name + '/pending');
        });
      }

      else if (user.rol.length > 0) {
        User.update(user.id, {accept: true, rol: user.rol}, function(err, data) {
          if (err) {
            console.log('Error: ', err);
            return res.send(500, err);
          }
          res.redirect('/users/' + req.session.user.id + '/' + req.session.user.rol.name + '/pending');
        });
      }
    }
  });
}

function deleteRoles(user, name) {
  var rol = user.rol;
  var index = -1;

  for (var i in rol) {
    if (rol[i].name == name) {
      index = i;
      break;
    }
  }

  if (index != -1) {
    rol.splice(index, 1);
  }

  user.rol = rol;
  return user;
}
