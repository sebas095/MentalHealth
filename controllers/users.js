const User = require('../models/user');
const uuid = require('uuid');

exports.create = function(req, res) {
  var roles = [];
  if (req.body.paciente) {
    roles.push({
      name: req.body.paciente,
      photo: null,
      ok: false
    });
  }
  if (req.body.medicoGeneral) {
    roles.push({
      name: req.body.medicoGeneral,
      photo: null,
      ok: false
    });
  }
  if (req.body.medicoEspecialista) {
    roles.push({
      name: req.body.medicoEspecialista,
      photo: null,
      ok: false
    });
  }

  User.create({
    id: uuid.v4(),
    documentType: req.body.typeDocument,
    documentNumber: req.body.numDocument,
    names: req.body.names,
    lastnames: req.body.lastnames,
    gender: req.body.gender,
    birthdate: req.body.birthdate,
    email: req.body.mail,
    phone: req.body.phone,
    address: req.body.address,
    epsRelated: req.body.epsRelated,
    roles: roles,
    password: req.body.pwd,
    accept: false
  }, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    res.redirect('/');
  });
}
