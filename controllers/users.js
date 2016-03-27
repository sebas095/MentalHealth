const User = require('../models/user');
const Eps = require('../models/eps');
const Root = require('../models/root');
const uuid = require('uuid');

exports.create = function(req, res) {
  var roles = [];
  if (req.body.paciente) {
    roles.push({
      name: req.body.paciente,
      photo: null
    });
  }
  if (req.body.medicoGeneral) {
    roles.push({
      name: req.body.medicoGeneral,
      photo: null
    });
  }
  if (req.body.medicoEspecialista) {
    roles.push({
      name: req.body.medicoEspecialista,
      photo: null
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

exports.new = function(req, res) {
  Root.find({accept: true}, function(err, data) {
    if (err) {
      console.log('Error: ', err);
      return res.send(500, err);
    }
    if (data.length == 0) {
      res.render('users/new', {hasRoot: false});
    }
    else res.render('users/new', {hasRoot: true});
  });
}

exports.edit = function(req, res) {
  res.render('users/edit');
}

exports.saveChanges = function(req, res) {
  var user = {};
  if (!Array.isArray(req.session.user.rol)) {
    if (req.session.user.rol.name == 'eps') {
      if (req.body.nit)          user.documentNumber = req.body.nit;
      if (req.body.nameEps)      user.names = req.body.nameEps;
      if (req.body.mailEps)      user.email = req.body.mailEps;
      if (req.body.phoneEps)     user.epsPhone = req.body.phoneEps;
      if (req.body.addressEps)   user.address = req.body.addressEps;
      if (req.body.typeDocument) user.documentType = req.body.typeDocument;
      if (req.body.numDocument)  user.documentNumberPerson = req.body.numDocument;
      if (req.body.names)        user.namesPerson = req.body.names;
      if (req.body.lastnames)    user.lastnames = req.body.lastnames;
      if (req.body.gender)       user.gender = req.body.gender;
      if (req.body.phone)        user.phone = req.body.phone;
      if (req.body.pwd)          user.password = req.body.pwd;

      Eps.update(req.session.user.id, user, function(err, data) {
        if (err) {
          console.log('Error: ', err);
          return res.send(500, err);
        }
        res.redirect('/users/' + req.session.user.id);
      });
    }
    else {
      if (req.body.typeDocument) user.documentType = req.body.typeDocument;
      if (req.body.numDocument)  user.documentNumber = req.body.numDocument;
      if (req.body.names)        user.names = req.body.names;
      if (req.body.lastnames)    user.lastnames = req.body.lastnames;
      if (req.body.gender)       user.gender = req.body.gender;
      if (req.body.birthdate)    user.birthdate = req.body.birthdate;
      if (req.body.mail)         user.email = req.body.mail;
      if (req.body.phone)        user.phone = req.body.phone;
      if (req.body.address)      user.address = req.body.address;
      if (req.body.pwd)          user.password = req.body.pwd;

      Root.update(req.session.user.id, user, function(err, data) {
        if (err) {
          console.log('Error: ', err);
          return res.send(500, err);
        }
        res.redirect('/users/' + req.session.user.id);
      });
    }
  }
  else {
    if (req.body.typeDocument) user.documentType = req.body.typeDocument;
    if (req.body.numDocument)  user.documentNumber = req.body.numDocument;
    if (req.body.names)        user.names = req.body.names;
    if (req.body.lastnames)    user.lastnames = req.body.lastnames;
    if (req.body.gender)       user.gender = req.body.gender;
    if (req.body.birthdate)    user.birthdate = req.body.birthdate;
    if (req.body.mail)         user.email = req.body.mail;
    if (req.body.phone)        user.phone = req.body.phone;
    if (req.body.address)      user.address = req.body.address;
    if (req.body.epsRelated)   user.epsRelated = req.body.epsRelated;
    if (req.body.pwd)          user.password = req.body.pwd;

    User.update(req.session.user.id, user, function(err, data) {
      if (err) {
        console.log('Error: ', err);
        return res.send(500, err);
      }
      res.redirect('/users/' + req.session.user.id);
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
