const User = require('../models/user');
const Eps = require('../models/eps');
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
    rol: roles,
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

exports.pending = function(req, res) {
  if (req.params.rol == 'root') {
    Eps.find({accept: false}, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }
      if (data.length == 0) {
        res.render('admin/pending', {allUsers: []});
      }
      else {
        res.render('admin/pending',{allUsers: data});
      }
    });
  }
  else {
    User.find({accept: false}, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }
      if (data.length == 0) {
        res.render('admin/pending', {allUsers: []});
      }
      else {
        res.render('admin/pending',{allUsers: data});
      }
    });
  }
}

exports.allowUser = function(req, res) {
  req.session.pendingUser = req.body;
  res.redirect('/users/' + req.session.user.id + '/' + req.session.user.rol.name + '/allow');
}

exports.allow = function(req, res) {
  var rol = req.params.rol;
  var user = req.session.pendingUser.requests.split('-');

  if (rol == 'eps') {
    User.find({
      names: user[0],
      documentNumber: user[1]
    }, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }
      else {
        res.render('admin/allowUsers', {allowUser: data[0]});
      }
    });
  }

  else {
    Eps.find({
      names: user[0],
      documentNumber: user[1]
    }, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }
      else {
        res.render('admin/allowEps', {allowUser: data[0]});
      }
    });
  }
}
